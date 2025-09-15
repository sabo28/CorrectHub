import { RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";

export function handler(
  _req: Request,
  ctx: RouteContext<unknown, IApplication>,
): Response {
  return Response.redirect(ctx.state.siteConfiguration.baseUrl, 301);
}
