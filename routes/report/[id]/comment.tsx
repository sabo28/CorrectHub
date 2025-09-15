import { RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import CommentHandler from "@handler/comment-handler.ts";

export const handler = {
  async POST(req: Request, ctx: RouteContext<unknown, IApplication>) {
    const handler = new CommentHandler(ctx.state);
    return await handler.create(req, ctx.params.id);
  },
};
