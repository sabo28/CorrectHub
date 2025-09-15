import Uuid from "../value-objects/uuid.ts";
import PasswordResetToken from "./passwordResetToken.ts";

export default interface IPasswordResetTokenRepository {
  create(token: PasswordResetToken): Promise<PasswordResetToken>;

  getById(id: Uuid): Promise<PasswordResetToken>;

  getByUserId(userId: Uuid): Promise<PasswordResetToken>;

  delete(token: PasswordResetToken): Promise<void>;

  update(token: PasswordResetToken): Promise<PasswordResetToken>;
}
