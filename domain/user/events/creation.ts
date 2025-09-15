import Event from "../../event/event.ts";
import Email from "../../value-objects/email.ts";
import Uuid from "../../value-objects/uuid.ts";
import User from "../user.ts";
import VerificationCode from "../verification-code.ts";

export default class UserCreationEvent extends Event {
  readonly userId: Uuid;
  readonly username: string;
  readonly email: Email;
  readonly verificationCode: VerificationCode;
  readonly emailVerified: boolean;

  constructor(user: User) {
    super();
    this.userId = user.id;
    this.username = user.username;
    this.email = user.email;
    this.verificationCode = user.verificationCode;
    this.emailVerified = user.emailVerified;
  }
}
