import Uuid from "../../value-objects/uuid.ts";
import { AlreadyExists, DoesNotExist } from "../error.ts";
import PasswordResetToken from "../passwordResetToken.ts";
import IPasswordResetTokenRepository from "../repository.ts";

type PasswordResetTokenTestRepositoryOverrideFunctions = Partial<{
  create: () => Promise<PasswordResetToken>;
  getById: () => Promise<PasswordResetToken>;
  getByUserId: () => Promise<PasswordResetToken>;
  delete: () => Promise<void>;
  update: () => Promise<PasswordResetToken>;
}>;

export default class PasswordResetTokenTestRepository
  implements IPasswordResetTokenRepository {
  private tokens: Map<string, PasswordResetToken> = new Map();
  private overrideFunctions: PasswordResetTokenTestRepositoryOverrideFunctions;

  constructor(
    overrideFunctions?: PasswordResetTokenTestRepositoryOverrideFunctions,
  ) {
    this.overrideFunctions = overrideFunctions ?? {};
  }

  async create(token: PasswordResetToken): Promise<PasswordResetToken> {
    if (this.overrideFunctions.create) {
      return this.overrideFunctions.create();
    }

    if (this.tokens.has(token.id.toString())) {
      return await Promise.reject(new AlreadyExists(token.id));
    }

    this.tokens.set(token.id.toString(), token);
    return token;
  }

  getById(id: Uuid): Promise<PasswordResetToken> {
    if (this.overrideFunctions.getById != null) {
      return this.overrideFunctions.getById();
    }
    const token = this.tokens.get(id.toString());
    if (!token) {
      return Promise.reject(new DoesNotExist(id));
    }
    return Promise.resolve(token);
  }

  getByUserId(userId: Uuid): Promise<PasswordResetToken> {
    if (this.overrideFunctions.getByUserId != null) {
      return this.overrideFunctions.getByUserId();
    }
    for (const token of this.tokens.values()) {
      if (token.userId === userId) {
        return Promise.resolve(token);
      }
    }
    return Promise.reject(new DoesNotExist(userId));
  }

  delete(token: PasswordResetToken): Promise<void> {
    if (this.overrideFunctions.delete != null) {
      return this.overrideFunctions.delete();
    }
    if (!this.tokens.has(token.id.toString())) {
      throw new DoesNotExist(token.id);
    }
    this.tokens.delete(token.id.toString());
    return Promise.resolve();
  }

  update(token: PasswordResetToken): Promise<PasswordResetToken> {
    if (this.overrideFunctions.update != null) {
      return this.overrideFunctions.update();
    }
    if (!this.tokens.has(token.id.toString())) {
      throw new DoesNotExist(token.id);
    }
    this.tokens.set(token.id.toString(), token);
    return Promise.resolve(token);
  }
}
