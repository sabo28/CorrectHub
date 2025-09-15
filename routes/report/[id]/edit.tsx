import { Handlers, PageProps } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import ReportForm from "../../../islands/ReportForm.tsx";
import { Head } from "$fresh/runtime.ts";
import ReportHandler from "@handler/report-handler.ts";
import { Result } from "@utils/result.ts";
import { errorResponseHandler, Unauthorized } from "@handler/errors.ts";
import Report from "@domain/report/report.ts";
import { IPrimitiveUser } from "@domain/user/user.ts";

interface IReportEditPageProps {
  report: Report;
}

export const handler: Handlers<unknown, IApplication> = {
  async GET(_req, ctx) {
    const handler = new ReportHandler(ctx.state);
    const result = await handler.get(ctx.params.id);

    if (result.isErr()) {
      if (result.unwrapErrName() === "ReportDoesNotExist") {
        return ctx.renderNotFound();
      }
      throw result.unwrapErr();
    }

    const canEditReport = ctx.state.currentUser.unwrap().permissions
      .canEditReport(result.unwrap().user.id);
    if (!canEditReport) {
      throw new Unauthorized();
    }

    return ctx.render({ report: result.unwrap() });
  },

  async POST(request: Request, ctx) {
    const handler = new ReportHandler(ctx.state);

    const reportResponse = await Result.from(
      handler.update(request, ctx.params.id),
    );

    if (reportResponse.isErr()) {
      console.error(reportResponse.unwrapErr());
      const responseBody = errorResponseHandler(reportResponse.unwrapErr());
      return new Response(JSON.stringify(responseBody), {
        status: responseBody.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response = new Response(JSON.stringify(reportResponse.unwrap()));
    response.headers.append("Content-Type", "application/json");
    return response;
  },
};

export default async function Page(
  _req: Request,
  props: PageProps<IReportEditPageProps, IApplication>,
) {
  const report = props.data.report;

  const user = props.state.currentUser.unwrap();
  const canChangePriority = user.permissions.canChangePriority();
  const canChangeAssignee = user.permissions.canChangeAssignee();

  let availableAssignees: IPrimitiveUser[] = [];
  if (canChangeAssignee) {
    availableAssignees = (await props.state.userService.availableAssignees())
      .map((user) => user.toPrimitive());
  }

  return (
    <>
      <Head>
        <title>Meldung bearbeiten - CorrectHub</title>
      </Head>
      <main class="max-w-2xl mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Meldung bearbeiten</h1>
        <ReportForm
          report={report.toPrimitive()}
          canSetPriority={canChangePriority}
          canSetAssignee={canChangeAssignee}
          availableAssignees={availableAssignees}
        />
      </main>
    </>
  );
}
