import ReportTable from "../islands/ReportTable.tsx";
import Headline from "../components/Headline.tsx";
import { Handlers, RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import { Unauthorized } from "@handler/errors.ts";
import Report, { IPrimitiveReport } from "@domain/report/report.ts";
import ReportHandler from "@handler/report-handler.ts";

interface IDashboardPage {
  reports: IPrimitiveReport[];
  orderBy: keyof Report;
  sortOrder: "asc" | "desc";
  query: string;
}

export const handler: Handlers<unknown, IApplication> = {
  async GET(request, ctx) {
    if (!ctx.state.loggedIn) {
      throw new Unauthorized();
    }

    const handler = new ReportHandler(ctx.state);
    const { reports, orderBy, sortOrder, query } = await handler.list(request);

    return ctx.render({
      reports: reports.map((report) => report.toPrimitive()),
      orderBy: orderBy ?? "createdAt",
      sortOrder: sortOrder,
      query: query ?? "",
    });
  },
};

export default function DashboardPage(
  props: RouteContext<IDashboardPage, IApplication>,
) {
  return (
    <>
      <div class="w-full">
        <div class="flex justify-center items-center mb-8">
          <Headline>Willkommen im Dashboard</Headline>
        </div>

        <ReportTable
          reports={props.data.reports}
          orderBy={Report.fieldToPrimitiveMap(props.data.orderBy) ??
            "createdAtMillis"}
          sortOrder={props.data.sortOrder}
          query={props.data.query}
        />
      </div>
    </>
  );
}
