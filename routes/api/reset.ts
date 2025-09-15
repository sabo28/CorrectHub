import { Handlers } from "$fresh/server.ts";
import type { IApplication } from "@handler/application.ts";
import PasswordResetTokenHandler from "@handler/reset-password-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  async POST(request: Request, ctx) {
    const handler = new PasswordResetTokenHandler(
      ctx.state.passwordResetTokenService,
    );
    const PasswordResetTokenResponse = await handler.resetPassword(request);
    return new Response(JSON.stringify(PasswordResetTokenResponse));
  },
};
