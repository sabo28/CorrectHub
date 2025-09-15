import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";

export interface IPrimitivePasswordResetToken {
  id: string;
  userId: string;
  createdAtMillis: number;
  expiresAtMillis: number;
}

export default class PasswordResetToken {
  readonly id: Uuid;
  readonly userId: Uuid;
  readonly createdAt: Timestamp;
  readonly expiresAt: Timestamp;

  constructor(
    id: Uuid,
    userId: Uuid,
    createdAt: Timestamp,
    expiresAt: Timestamp,
  ) {
    if (id == null) {
      throw new Error("PasswordResetTokenEntity: missing id");
    }

    if (userId == null) {
      throw new Error("PasswordResetTokenEntity: missing userId");
    }

    if (createdAt == null) {
      throw new Error("PasswordResetTokenEntity: missing createdAt");
    }

    if (expiresAt == null) {
      throw new Error("PasswordResetTokenEntity: missing expiresAt");
    }

    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
  }

  toString(): string {
    return this.id.toString();
  }

  get isActive(): boolean {
    return Timestamp.now().toUnix() < this.expiresAt.toUnix();
  }
}
