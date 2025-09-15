import Uuid from "@domain/value-objects/uuid.ts";
import Email from "@domain/value-objects/email.ts";
import Timestamp, { TimeUnit } from "@domain/value-objects/timestamp.ts";
import PasswordResetRequestedEvent from "./events/passwordResetRequestedEvent.ts";
import { EmailDoesNotExist } from "@domain/user/error.ts";
import { Result } from "@utils/result.ts";
import IUserRepository from "@domain/user/repository.ts";
import IPasswordResetTokenRepository from "@domain/password-reset-token/repository.ts";
import PasswordResetToken from "@domain/password-reset-token/passwordResetToken.ts";
import IEventService from "../event/service.ts";
import Password from "../value-objects/password.ts";

export default interface IPasswordResetTokenService {
  resetPassword(email: string): Promise<PasswordResetToken>;
  findById(id: Uuid): Promise<PasswordResetToken>;
}

export default class PasswordResetTokenService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
    private readonly eventService: IEventService,
  ) {}

  async resetPassword(email: string): Promise<PasswordResetToken> {
    const userResult = await Result.from(
      this.userRepository.getByEmail(new Email(email)),
    );

    if (userResult.isErr()) {
      throw new EmailDoesNotExist(new Email(email));
    }

    const user = userResult.unwrap();

    const resetToken = Uuid.newRandom();

    const newResetToken = new PasswordResetToken(
      resetToken,
      user.id,
      Timestamp.now(),
      Timestamp.in(30, TimeUnit.MINUTES),
    );
    await this.resetTokenRepository.create(newResetToken);

    await this.eventService.publish(
      new PasswordResetRequestedEvent(user.id, user.email, resetToken),
    );

    return newResetToken;
  }

  async findById(id: Uuid): Promise<PasswordResetToken> {
    return await this.resetTokenRepository.getById(id);
  }

  async delete(id: Uuid): Promise<void> {
    const token = await this.resetTokenRepository.getById(id);
    if (!token) {
      throw new Error("Reset-Token existiert nicht");
    }
    await this.resetTokenRepository.delete(token);
  }

  async updatePasswordWithToken(
    newPassword: string,
    token: Uuid,
  ): Promise<PasswordResetToken> {
    const tokenEntity = await this.resetTokenRepository.getById(token);
    if (!tokenEntity) {
      throw new Error("Reset-Token existiert nicht");
    }

    if (!tokenEntity.isActive) {
      await this.resetTokenRepository.delete(tokenEntity);
      throw new Error("Reset-Token ist nicht mehr aktiv");
    }

    const user = await this.userRepository.getById(tokenEntity.userId);
    if (!user) {
      throw new Error("Benutzer existiert nicht");
    }

    user.password = Password.hash(newPassword);
    await this.userRepository.update(user);

    await this.resetTokenRepository.delete(tokenEntity);

    return tokenEntity;
  }
}
