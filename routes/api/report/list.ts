import { Handlers } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import { Unauthorized } from "@handler/errors.ts";
import ReportHandler from "@handler/report-handler.ts";

export const handler: Handlers<unknown, IApplication> = {
  async GET(request: Request, ctx) {
    if (!ctx.state.loggedIn) {
      throw new Unauthorized();
    }

    const handler = new ReportHandler(ctx.state);
    const result = await handler.list(request);

    return new Response(
      JSON.stringify(result.reports.map((report) => report.toPrimitive())),
    );
  },
};
