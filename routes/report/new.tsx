import { Handlers, PageProps } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import ReportForm from "../../islands/ReportForm.tsx";
import ReportHandler from "../../handler/report-handler.ts";
import { errorResponseHandler, Unauthorized } from "@handler/errors.ts";
import { Result } from "@utils/result.ts";
import { Head } from "$fresh/runtime.ts";
import { IPrimitiveUser } from "@domain/user/user.ts";

export const handler: Handlers<unknown, IApplication> = {
  async POST(request: Request, ctx) {
    const handler = new ReportHandler(ctx.state);

    const reportResponse = await Result.from(
      handler.create(request),
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
  props: PageProps<unknown, IApplication>,
) {
  if (!props.state.loggedIn) {
    throw new Unauthorized();
  }

  const user = props.state.currentUser.unwrap();
  const canChangePriority = props.state.currentUser.unwrap().permissions
    .canChangePriority();
  const canChangeAssignee = user.permissions.canChangeAssignee();

  let availableAssignees: IPrimitiveUser[] = [];
  if (canChangeAssignee) {
    availableAssignees = (await props.state.userService.availableAssignees())
      .map((user) => user.toPrimitive());
  }

  return (
    <>
      <Head>
        <title>Neue Meldung erstellen - CorrectHub</title>
      </Head>
      <h1 class="text-2xl font-bold mb-6 text-center">
        Meldung erstellen
      </h1>
      <ReportForm
        canSetPriority={canChangePriority}
        canSetAssignee={canChangeAssignee}
        availableAssignees={availableAssignees}
      />
    </>
  );
}
