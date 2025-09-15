/**
 * Implements an E-Mail Transporter using https://resend.com/.
 */

import { IContact } from "./contact.ts";
import { Resend } from "npm:resend";
import IEmailTransporter, { IEmailEnvelope } from "./mod.ts";
import { Result } from "@utils/result.ts";

export default class ResendTransporter implements IEmailTransporter {
  constructor(private readonly apiKey: string) {}

  async send(envelope: IEmailEnvelope): Promise<boolean> {
    const resend = new Resend(this.apiKey);

    const receipients = Array.isArray(envelope.to)
      ? envelope.to
      : [envelope.to];

    const result = await Result.from(resend.emails.send({
      from: toResendContact(envelope.from),
      to: receipients.map(toResendContact),
      subject: envelope.subject,
      text: envelope.text,
      html: envelope.html,
    }));

    if (result.isErr()) {
      console.error(result.unwrapErr());
    }

    return result.isOk();
  }
}

function toResendContact(contact: IContact): string {
  if (contact.name.isSome()) {
    return `${contact.name.unwrap()} <${contact.email.toString()}>`;
  }

  return contact.email.toString();
}
