import { Handlers } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import SessionHandler from "../../handler/session-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  async POST(request, ctx) {
    const handler = new SessionHandler(ctx.state.sessionService);
    const [response, session] = await handler.logout(
      request,
      ctx.state.siteConfiguration,
    );

    return new Response(JSON.stringify(session), {
      headers: response.headers,
    });
  },
};
