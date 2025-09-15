import { Handlers, RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import StatusDropdown from "../../islands/StatusDropdown.tsx";
import { Button } from "../../islands/Button.tsx";
import Report from "@domain/report/report.ts";
import ReportHandler from "@handler/report-handler.ts";
import ReportDetailTabs from "../../islands/ReportDetailTabs.tsx";
import { Head } from "$fresh/runtime.ts";
import AttachmentList from "../../components/AttachmentList.tsx";
import RelativeDate from "../../components/RelativeDate.tsx";

interface IReportDetailPageProps {
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

    return ctx.render({ report: result.unwrap() });
  },
};

export default async function ReportDetailPage(
  _req: Request,
  ctx: RouteContext<IReportDetailPageProps, IApplication>,
) {
  const user = ctx.state.currentUser.unwrap();
  const reportId = new Uuid(ctx.params.id);

  const report = ctx.data.report;
  const reportEvents = await ctx.state.reportLifecycleService.list(reportId);
  const comments = await ctx.state.commentService.getByReportId(reportId);

  const attachments = await ctx.state.attachmentService.listByReport(reportId);

  const canEdit = user.permissions.canEditReport(report.user.id);
  const canChangeStatus = user.permissions.canChangeStatus();
  const canCreateComment = user.permissions.canCreateComment(report.user.id);

  return (
    <>
      <Head>
        <title>{report.title} - CorrectHub</title>
      </Head>

      <div class="max-w-5xl mx-auto px-4 md:px-8 py-10 text-sm text-gray-800 font-sans bg-white">
        <div class="mb-6">
          <div class="mb-4">
            <p class="text-xs uppercase text-gray-500 mb-1">Titel</p>
            <h1 class="text-2xl font-semibold">{report.title}</h1>
          </div>

          <div class="flex flex-col sm:flex-row gap-2">
            <StatusDropdown
              value={report.status.value}
              updateReportId={report.id.toString()}
              disabled={!canChangeStatus}
            />
            {canEdit && (
              <Button href={`/report/${ctx.params.id}/edit`} variant="regular">
                Bearbeiten
              </Button>
            )}
          </div>
        </div>

        <div class="space-y-6 border-t border-b border-gray-200 py-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-gray-500 block">Kategorie</label>
              <p class="mt-1">{report.category.toLocale()}</p>
            </div>
            <div>
              <label class="text-gray-500 block">Priorität</label>
              <p class="mt-1">{report.priority.toLocale()}</p>
            </div>
            <div class="md:col-span-2">
              <label class="text-gray-500 block">Beschreibung</label>
              <div class="mt-1 whitespace-pre-wrap break-words">
                {report.description}
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="text-gray-500 block">Links</label>
              {report.links.length > 0
                ? (
                  <ul class="list-disc list-inside space-y-1">
                    {report.links.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.toString()}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-blue-600 hover:underline break-all"
                        >
                          {link.toString()}
                        </a>
                      </li>
                    ))}
                  </ul>
                )
                : <p class="text-gray-500 italic">Keine Links vorhanden.</p>}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="text-gray-500 block">Author</label>
              <p class="mt-1">{report.displayUserName}</p>
            </div>
            <div>
              <label class="text-gray-500 block">Zugewiesen an</label>
              {report.assignee
                ? <p class="mt-1">{report.assignee.username}</p>
                : <p class="mt-1 text-gray-500 italic">Keine Zuweisung</p>}
            </div>
            <div>
              <label class="text-gray-500 block">Erstellt am</label>
              <p class="mt-1">
                <RelativeDate unixMillis={report.createdAt.toUnixMillis()} />
              </p>
            </div>
            <div>
              <label class="text-gray-500 block">Geändert am</label>
              <p class="mt-1">
                <RelativeDate unixMillis={report.updatedAt.toUnixMillis()} />
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="text-base font-medium mb-2 text-gray-700">Anhänge</h2>
          {attachments.length > 0
            ? (
              <AttachmentList
                attachments={attachments.map((a) => a.id.toString())}
              />
            )
            : <p class="text-gray-500 italic">Keine Anhänge vorhanden.</p>}
        </div>

        <div class="mt-10">
          <ReportDetailTabs
            reportId={reportId.toString()}
            events={reportEvents.map((event) => event.toPrimitive())}
            comments={comments.map((comment) => comment.toPrimitive())}
            canCreateComment={canCreateComment}
          />
        </div>
      </div>
    </>
  );
}
