import { Option } from "@utils/option.ts";
import Email from "@domain/value-objects/email.ts";

export interface IContact {
  name: Option<string>;
  email: Email;
}

export class Contact implements IContact {
  readonly name: Option<string>;
  readonly email: Email;

  constructor(email: string | Email, name?: string) {
    this.name = Option.from(name);
    this.email = new Email(email);
  }
}
