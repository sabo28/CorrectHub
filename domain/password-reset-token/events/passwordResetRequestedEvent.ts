import Event from "../../event/event.ts";
import Email from "../../value-objects/email.ts";
import Uuid from "../../value-objects/uuid.ts";

export default class PasswordResetRequestedEvent extends Event {
  readonly userId: Uuid;
  readonly email: Email;
  readonly resetToken: Uuid;

  constructor(userId: Uuid, email: Email, token: Uuid) {
    super();
    this.userId = userId;
    this.email = email;
    this.resetToken = token;
  }
}
