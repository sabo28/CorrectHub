import { FreshContext } from "$fresh/server.ts";
import { errorResponseHandler } from "@handler/errors.ts";
import Application, { IApplication } from "@handler/application.ts";
import createDatabaseClientWithMigration from "../../persistence/db.ts";

export async function handler(
  req: Request,
  ctx: FreshContext<IApplication>,
) {
  const db = await createDatabaseClientWithMigration();
  const application = new Application(req, db);
  await application.init();
  ctx.state = application;

  try {
    const resp = await ctx.next();
    resp.headers.set("Content-Type", "application/json");
    return resp;
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e : new Error("unknown error");

    const errorResponse = errorResponseHandler(error);
    const resp = new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode,
    });
    resp.headers.set("Content-Type", "application/json");
    return resp;
  }
}
