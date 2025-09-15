import Email from "../value-objects/email.ts";
import Uuid from "../value-objects/uuid.ts";

export class DoesNotExist extends Error {
  private readonly id: Uuid;
  override name = "UserDoesNotExist";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `User with id '${this.id.toString()}' does not exist`;
  }
}

export class UserDoesNotExist extends Error {
  private readonly userName: string;
  override name = "UserDoesNotExist";

  constructor(userName: string) {
    super();
    this.userName = userName;
  }

  override get message(): string {
    return `User with username '${this.userName}' does not exist`;
  }
}

export class EmailDoesNotExist extends Error {
  private readonly email: Email;
  override name = "UserEmailDoesNotExist";

  constructor(email: Email) {
    super();
    this.email = email;
  }

  override get message(): string {
    return `User with email '${this.email.toString()}' does not exist`;
  }
}

export class AlreadyExists extends Error {
  private readonly id: Uuid;
  override name = "UserAlreadyExists";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `User with id '${this.id.toString()}' already exists`;
  }
}

export class EmailAlreadyExists extends Error {
  private readonly email: Email;
  override name = "UserEmailAlreadyExists";

  constructor(email: Email) {
    super();
    this.email = email;
  }

  override get message(): string {
    return `User with email '${this.email.toString()}' does already exist`;
  }
}

export class UsernameAlreadyExists extends Error {
  override name = "UserUsernameAlreadyExists";

  constructor(private readonly username: string) {
    super();
  }

  override get message(): string {
    return `User with username '${this.username}' already exists`;
  }
}

export class InvalidVerificationCode extends Error {
  override name = "UserInvalidVerificationCode";

  constructor() {
    super("Invalid verification code for given user");
  }
}

export class ResetPasswordTokenExpired extends Error {
  override name = "UserResetPasswordTokenExpired";

  constructor() {
    super("Password reset token is expired");
  }
}

export class InvalidResetPasswordToken extends Error {
  override name = "UserInvalidResetPasswordToken";

  constructor() {
    super("Invalid password reset token");
  }
}
