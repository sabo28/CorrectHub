import { Handlers } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import ReportHandler from "@handler/report-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  GET(_request, ctx) {
    return new Response("", {
      status: 303,
      headers: {
        Location: `/report/${encodeURIComponent(ctx.params.id)}/edit`,
      },
    });
  },

  async POST(request, ctx) {
    const handler = new ReportHandler(ctx.state);
    const reportId = new Uuid(ctx.params.id);
    return await handler.updateStatus(request, reportId);
  },
};
