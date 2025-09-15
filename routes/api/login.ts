import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import SessionHandler from "../../handler/session-handler.ts";
import { IApplication } from "@handler/application.ts";
import Timestap from "../../domain/value-objects/timestamp.ts";
import { Unauthorized } from "@handler/errors.ts";

export const handler: Handlers<unknown, IApplication> = {
  async POST(request: Request, ctx) {
    if (ctx.state.loggedIn) {
      throw new Unauthorized("Cannot login on active session");
    }

    const handler = new SessionHandler(ctx.state.sessionService);
    const session = await handler.login(request);
    const now = Timestap.now().toUnix();
    const expiresAt = session.expires_at - now;

    const secure = (new URL(request.url)).protocol === "https";

    const headers = new Headers();
    setCookie(headers, {
      name: ctx.state.siteConfiguration.sessionCookieName,
      value: session.id,
      maxAge: expiresAt,
      sameSite: "Lax",
      path: ctx.state.siteConfiguration.sessionCookiePath,
      secure,
      httpOnly: !secure,
    });

    return new Response(JSON.stringify(session), {
      status: 200,
      headers,
    });
  },
};
