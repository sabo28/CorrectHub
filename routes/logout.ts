import { IApplication } from "@handler/application.ts";
import SessionHandler from "../handler/session-handler.ts";
import { FreshContext } from "$fresh/server.ts";

export async function handler(
  request: Request,
  ctx: FreshContext<IApplication>,
) {
  const handler = new SessionHandler(ctx.state.sessionService);
  const [response] = await handler.logout(request, ctx.state.siteConfiguration);
  response.headers.append("Location", "/");

  return new Response(null, {
    status: 303,
    headers: response.headers,
  });
}
