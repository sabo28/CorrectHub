import z from "zod/v4";
import IPasswordResetTokenService from "@domain/password-reset-token/service.ts";
import PasswordResetToken from "@domain/password-reset-token/passwordResetToken.ts";
import { requestDataToObject } from "@utils/requestDataToObject.ts";
import Uuid from "@domain/value-objects/uuid.ts";

const PasswordResetTokenInput = z.object({
  email: z.email(),
});

export const PasswordResetTokenResponse = z.object({
  id: z.string(),
  userId: z.string(),
  createdAtMillis: z.number(),
  expiresAtMillis: z.number(),
});

const ChangePasswordInput = z.object({
  password: z.string(),
  token: z.uuid(),
});

type PasswordResetTokenResponse = z.infer<typeof PasswordResetTokenResponse>;

export default class PasswordResetTokenHandler {
  private readonly passwordResetService: IPasswordResetTokenService;

  constructor(passwordResetService: IPasswordResetTokenService) {
    this.passwordResetService = passwordResetService;
  }

  async resetPassword(request: Request): Promise<PasswordResetTokenResponse> {
    const maybeData = await requestDataToObject(request);
    if (maybeData.isErr()) {
      throw maybeData.unwrapErr();
    }

    const input = PasswordResetTokenInput.parse(maybeData.unwrap());

    const { email } = input;
    const passwordResetToken = await this.passwordResetService.resetPassword(
      email,
    );

    return this.toResetPasswordTokenResponse(passwordResetToken);
  }

  async changePasswordWithToken(
    request: unknown,
  ): Promise<PasswordResetTokenResponse> {
    const input = ChangePasswordInput.parse(request);

    const tokenEntity = await this.passwordResetService.findById(
      new Uuid(input.token),
    );

    if (!tokenEntity) {
      throw new Error("Reset-Token existiert nicht");
    }

    if (!tokenEntity.isActive) {
      await this.passwordResetService.delete(tokenEntity.id);
      throw new Error("Reset-Token ist abgelaufen");
    }

    const user = await this.passwordResetService.updatePasswordWithToken(
      input.password,
      new Uuid(input.token),
    );
    return this.toResetPasswordTokenResponse(user);
  }

  private toResetPasswordTokenResponse(
    passwordResetToken: PasswordResetToken,
  ): PasswordResetTokenResponse {
    return {
      id: passwordResetToken.id.toString(),
      userId: passwordResetToken.userId.toString(),
      createdAtMillis: passwordResetToken.createdAt.toUnixMillis(),
      expiresAtMillis: passwordResetToken.expiresAt.toUnixMillis(),
    };
  }
}
