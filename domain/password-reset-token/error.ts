import Uuid from "../value-objects/uuid.ts";

export class DoesNotExist extends Error {
  private readonly id: Uuid;
  override name = "PasswordResetTokenDoesNotExist";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `Password reset token with id '${this.id.toString()}' does not exist`;
  }
}

export class AlreadyExists extends Error {
  private readonly id: Uuid;
  override name = "PasswordResetTokenAlreadyExists";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `Password reset token with id '${this.id.toString()}' already exists`;
  }
}
