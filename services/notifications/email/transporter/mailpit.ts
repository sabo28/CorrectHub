import { IContact } from "./contact.ts";
import IEmailTransporter, { IEmailEnvelope } from "./mod.ts";

interface IMailPitContact {
  Email: string;
  Name: string;
}

export default class MailPit implements IEmailTransporter {
  constructor(private readonly host: string) {}

  async send(envelope: IEmailEnvelope): Promise<boolean> {
    const from = toContact(envelope.from);
    const to = Array.isArray(envelope.to)
      ? envelope.to.map(toContact)
      : [toContact(envelope.to)];

    const requestBody = {
      From: from,
      To: to,
      Subject: envelope.subject,
      HTML: envelope.html,
      Text: envelope.text,
    };

    const result = await fetch(`${this.host}/api/v1/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const resultJson = await result.json();
    if (!resultJson.ID) {
      throw new Error("sending was not successful");
    }

    console.log(`To: ${JSON.stringify(to)}`);
    console.log(requestBody.Text);

    return Promise.resolve(true);
  }
}

function toContact(contact: IContact): IMailPitContact {
  const output: IMailPitContact = {
    Email: contact.email.toString(),
    Name: contact.email.toString(),
  };
  if (contact.name.isSome()) {
    output.Name = contact.name.unwrap();
  }

  return output;
}
