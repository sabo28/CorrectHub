import { Handlers } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import AttachmentHandler from "@handler/attachment-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  async GET(_request: Request, ctx) {
    const handler = new AttachmentHandler(ctx.state);
    const response = await handler.get(ctx.params.id);
    return response;
  },
};
