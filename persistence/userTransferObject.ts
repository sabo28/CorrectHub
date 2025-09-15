import Email from "@domain/value-objects/email.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import User from "@domain/user/user.ts";
import VerificationCode from "@domain/user/verification-code.ts";
import Password from "@domain/value-objects/password.ts";
import Role, { RoleName } from "@domain/user/role.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";

interface UserTransferObjectInput {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  verificationCode: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class UserTransferObject {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly verificationCode: string;
  readonly password: string;
  readonly role: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(dbUser: UserTransferObjectInput) {
    this.id = dbUser.id;
    this.username = dbUser.username;
    this.email = dbUser.email;
    this.emailVerified = dbUser.emailVerified;
    this.verificationCode = dbUser.verificationCode;
    this.password = dbUser.password;
    this.role = dbUser.role || RoleName.MEMBER;
    this.createdAt = dbUser.createdAt;
    this.updatedAt = dbUser.updatedAt;
  }

  toUser(): User {
    return new User(
      new Uuid(this.id),
      this.username,
      new Email(this.email),
      this.emailVerified,
      new VerificationCode(this.verificationCode),
      new Password(this.password),
      new Role(this.role as RoleName),
      new Timestamp(this.createdAt),
      new Timestamp(this.updatedAt),
    );
  }

  static from(user: User): UserTransferObject {
    return new UserTransferObject({
      id: user.id.toString(),
      username: user.username,
      email: user.email.toString(),
      emailVerified: user.emailVerified,
      verificationCode: user.verificationCode.toString(),
      password: user.password.toString(),
      role: user.role.toString(),
      createdAt: user.createdAt.toDate(),
      updatedAt: user.updatedAt.toDate(),
    });
  }
}
