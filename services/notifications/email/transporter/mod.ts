import { IContact } from "./contact.ts";

export default interface IEmailTransporter {
  send(envelope: IEmailEnvelope): Promise<boolean>;
}

type ContactList = IContact | IContact[];

export interface IEmailEnvelope {
  from: IContact;
  to: ContactList;
  cc?: ContactList;
  bcc?: ContactList;
  subject: string;
  text: string;
  html?: string;
  headers?: Record<string, string>;
  replyTo?: ContactList;
}
