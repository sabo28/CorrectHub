import IPasswordResetTokenRepository from "@domain/password-reset-token/repository.ts";
import { passwordResetTokenSchema } from "./schema.ts";
import { DatabaseClient } from "./db.ts";
import PasswordResetToken from "@domain/password-reset-token/passwordResetToken.ts";
import PasswordResetTokenTransferObject from "./passwordResetTokenTransferObjects.ts";
import { eq } from "drizzle-orm";
import Uuid from "@domain/value-objects/uuid.ts";

export default class PasswordResetTokenRepository
  implements IPasswordResetTokenRepository {
  constructor(private readonly db: DatabaseClient) {}

  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    await this.db.insert(passwordResetTokenSchema).values({
      id: token.id.toString(),
      userId: token.userId.toString(),
      createdAt: token.createdAt.toDate(),
      expiresAt: token.expiresAt.toDate(),
    });
    return token;
  }

  async getById(id: Uuid): Promise<PasswordResetToken> {
    const result = await this.db.select().from(passwordResetTokenSchema).where(
      eq(passwordResetTokenSchema.id, id.toString()),
    );

    if (result.length === 0) {
      throw new Error(`Password reset token with ID ${id} does not exist.`);
    }

    return new PasswordResetTokenTransferObject(result[0])
      .toPasswordResetToken();
  }

  async getByUserId(userId: Uuid): Promise<PasswordResetToken> {
    const result = await this.db.select().from(passwordResetTokenSchema).where(
      eq(passwordResetTokenSchema.userId, userId.toString()),
    );

    if (result.length === 0) {
      throw new Error(`No password reset token found for user ID ${userId}.`);
    }

    return new PasswordResetTokenTransferObject(result[0])
      .toPasswordResetToken();
  }

  async delete(token: PasswordResetToken): Promise<void> {
    await this.db.delete(passwordResetTokenSchema).where(
      eq(passwordResetTokenSchema.id, token.id.toString()),
    );
  }

  async update(token: PasswordResetToken): Promise<PasswordResetToken> {
    await this.db.update(passwordResetTokenSchema).set({
      userId: token.userId.toString(),
      createdAt: token.createdAt.toDate(),
      expiresAt: token.expiresAt.toDate(),
    }).where(eq(passwordResetTokenSchema.id, token.id.toString()));

    return token;
  }
}
