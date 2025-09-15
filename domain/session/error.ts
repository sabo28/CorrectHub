import Email from "../value-objects/email.ts";
import Uuid from "../value-objects/uuid.ts";

export class DoesNotExist extends Error {
  private readonly id: Uuid;
  override name = "SessionDoesNotExist";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `Session with id '${this.id.toString()}' does not exist`;
  }
}

export class SessionWithUserIdDoesNotExist extends Error {
  private readonly userId: Uuid;
  override name = "SessionWithUserIdDoesNotExist";

  constructor(userId: Uuid) {
    super();
    this.userId = userId;
  }

  override get message(): string {
    return `Session with user id '${this.userId.toString()}' does not exist`;
  }
}

export class SessionAlreadyExists extends Error {
  private readonly id: Uuid;
  override name = "SessionAlreadyExists";

  constructor(id: Uuid) {
    super();
    this.id = id;
  }

  override get message(): string {
    return `Session with id '${this.id.toString()}' already exists`;
  }
}

export class InvalidCredentialsWithEmail extends Error {
  private readonly email: Email;
  override name = "InvalidCredentialsWithEmail";

  constructor(email: Email) {
    super();
    this.email = email;
  }

  override get message(): string {
    return `User '${this.email.toString()}' does not exist or password does not match`;
  }
}

export class InvalidCredentialsWithUsername extends Error {
  private readonly userName: string;
  override name = "InvalidCredentialsWithUsername";

  constructor(userName: string) {
    super();
    this.userName = userName;
  }

  override get message(): string {
    return `User '${this.userName.toString()}' does not exist or password does not match`;
  }
}

export class EmailNotVerified extends Error {
  override name = "SessionEmailNotVerified";

  constructor(readonly email: Email) {
    super(`Email address '${email.toString()}' not verified yet`);
  }
}
