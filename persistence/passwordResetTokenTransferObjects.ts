import Uuid from "@domain/value-objects/uuid.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import PasswordResetToken from "@domain/password-reset-token/passwordResetToken.ts";

interface PasswordResetTokenTransferObjectInput {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export default class PasswordResetTokenTransferObject {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;

  constructor(dbPasswordResetToken: PasswordResetTokenTransferObjectInput) {
    this.id = dbPasswordResetToken.id;
    this.userId = dbPasswordResetToken.userId;
    this.createdAt = dbPasswordResetToken.createdAt;
    this.expiresAt = dbPasswordResetToken.expiresAt;
  }

  toPasswordResetToken(): PasswordResetToken {
    return new PasswordResetToken(
      new Uuid(this.id),
      new Uuid(this.userId),
      new Timestamp(this.createdAt),
      new Timestamp(this.expiresAt),
    );
  }

  static from(token: PasswordResetToken): PasswordResetTokenTransferObject {
    return new PasswordResetTokenTransferObject({
      id: token.id.toString(),
      userId: token.userId.toString(),
      createdAt: token.createdAt.toDate(),
      expiresAt: token.expiresAt.toDate(),
    });
  }
}
