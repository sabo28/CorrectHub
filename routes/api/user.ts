import { Handlers } from "$fresh/server.ts";
import UserHandler from "@handler/user-handler.ts";
import type { IApplication } from "@handler/application.ts";
import { Unauthorized } from "@handler/errors.ts";
import PasswordResetTokenHandler from "@handler/reset-password-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  async POST(request, ctx) {
    if (ctx.state.loggedIn) {
      throw new Unauthorized("Cannot register while logged in");
    }

    const handler = new UserHandler(ctx.state.userService);
    const userResponse = await handler.create(request);
    return new Response(JSON.stringify(userResponse));
  },

  async PATCH(request, ctx) {
    const userServiceHandler = new UserHandler(ctx.state.userService);
    const passwordResetTokenHandler = new PasswordResetTokenHandler(
      ctx.state.passwordResetTokenService,
    );

    const body = await request.json();

    // Fall 1: Rolle ändern
    if (body.new_role) {
      if (!ctx.state.loggedIn) throw new Unauthorized();

      const userResponse = await userServiceHandler.changeRole(
        ctx.state.currentUser.unwrap(),
        body,
      );
      return new Response(JSON.stringify(userResponse));
    }

    // Fall 2: Passwort ändern (Mit Token)
    if (body.token) {
      const passwordResetTokenResponse = await passwordResetTokenHandler
        .changePasswordWithToken(body);
      return new Response(JSON.stringify(passwordResetTokenResponse));
    }

    // Fall 3: Passwort ändern (Eingeloggt)
    if (body.currentPassword && ctx.state.loggedIn) {
      const passwordResetTokenResponse = await userServiceHandler
        .changePassword(
          ctx.state.currentUser.unwrap(),
          body,
        );
      return new Response(JSON.stringify(passwordResetTokenResponse));
    }
    return new Response("Bad Request", { status: 400 });
  },
};
