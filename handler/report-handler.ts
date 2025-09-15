import Report from "@domain/report/report.ts";
import { requestDataToObject } from "@utils/requestDataToObject.ts";
import { z } from "zod/v4";
import Attachment from "@domain/attachment/attachment.ts";
import { Buffer } from "node:buffer";
import Uuid from "@domain/value-objects/uuid.ts";
import { DoesNotExist } from "@domain/session/error.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import { IApplication } from "./application.ts";
import ReportCategory, { CategoryName } from "@domain/report/category.ts";
import { StatusName } from "@domain/report/status.ts";
import { Err, Result } from "@utils/result.ts";
import { BadRequest, Unauthorized } from "./errors.ts";
import { ReportDoesNotExist } from "@domain/report/error.ts";
import Priority, { priorityLocalMap } from "@domain/report/priority.ts";
import Link from "@domain/report/link.ts";

const attachmentFileInput = z.file("image/jpeg,image/png,image/gif");

const ReportInput = z.object({
  title: z.string(),
  description: z.string(),
  isAnonym: z.string().default("false"),
  category: z.enum(Object.values(CategoryName)),
  priority: z.enum(Object.keys(priorityLocalMap)).optional(),
  assignee: z.string().optional(),
  links: z.string().optional(),
  attachments: z
    .array(attachmentFileInput)
    .or(attachmentFileInput)
    .optional(),
});

const StatusInput = z.object({
  status: z.enum(Object.values(StatusName)),
});

export const ReportResponse = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  user_name: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.string(),
  attachments: z.array(z.uuid()).optional(),
  created_at: z.number(),
  updated_at: z.number(),
});

type ReportResponse = z.infer<typeof ReportResponse>;

export default class ReportHandler {
  constructor(private readonly app: IApplication) {}

  async get(reportId: string): Promise<Result<Report, Error>> {
    const id = Result.fromSync(() => new Uuid(reportId));
    if (id.isErr()) {
      throw new BadRequest("Report ID ist ungültig");
    }

    const result = await Result.from(
      this.app.reportService.findById(id.unwrap()),
    );

    if (result.isErr()) {
      if (result.unwrapErr().constructor.name === "ReportDoesNotExist") {
        return Err(new ReportDoesNotExist(id.unwrap()));
      }

      throw result.unwrapErr();
    }

    const report = result.unwrap();
    const canView = this.app.loggedIn
      ? this.app.currentUser.unwrap().permissions.canViewReport(report.user.id)
      : false;

    if (!canView) {
      throw new Unauthorized();
    }

    return result;
  }

  async list(request: Request): Promise<{
    orderBy?: keyof Report;
    sortOrder: "asc" | "desc";
    query?: string;
    reports: Report[];
  }> {
    const url = new URL(request.url);

    const orderByField =
      (url.searchParams.get("orderBy") ?? "createdAt") as keyof Report;
    const orderBy = Report.primitiveToFieldMap(
      Report.fieldToPrimitiveMap(orderByField) ?? "createdAtMillis",
    );
    const sortOrder = url.searchParams.get("direction") === "desc"
      ? "desc"
      : "asc";
    const query = url.searchParams.get("q") ?? undefined;

    const reports = await this.app.reportService.list(
      this.app.currentUser.unwrap(),
      {
        title: query ?? undefined,
        description: query ?? undefined,
      },
      orderBy,
      sortOrder,
    );

    return {
      orderBy,
      sortOrder,
      query,
      reports,
    };
  }

  async create(request: Request): Promise<ReportResponse> {
    if (!this.app.loggedIn) {
      throw new Unauthorized();
    }

    const maybeData = await requestDataToObject<unknown>(request);
    if (maybeData.isErr()) throw maybeData.unwrapErr();

    const input = ReportInput.parse(maybeData.unwrap());
    const { title, description, isAnonym, category } = input;

    const user = this.app.currentUser.unwrap();
    const assignee = input.assignee
      ? await this.app.userRepository.getById(new Uuid(input.assignee))
      : undefined;

    const anonym = isAnonym === "true";
    const reportCategory = new ReportCategory(category as CategoryName);

    const report = await this.app.reportService.create(
      user,
      title,
      description,
      reportCategory,
      anonym,
      input.priority ? +input.priority : undefined,
      input.links,
      assignee,
    );

    // Create attachments
    const files = getFilesFromInput(input);
    const attachments: Attachment[] = [];
    for (const file of files) {
      const data = await file.arrayBuffer();
      const attachment = await this.app.attachmentService.create(
        report.id,
        report.user.id,
        file.type,
        Buffer.from(data),
      );

      attachments.push(attachment);
    }

    return this.toReportResponse(report, attachments);
  }

  async update(
    request: Request,
    reportId: string,
  ): Promise<ReportResponse> {
    const maybeData = await requestDataToObject<unknown>(request);
    if (maybeData.isErr()) throw maybeData.unwrapErr();

    const input = ReportInput.parse(maybeData.unwrap());
    const { title, description, isAnonym, category } = input;

    if (!this.app.loggedIn) {
      throw new Error("Unauthorized");
    }

    const user = this.app.currentUser.unwrap();

    const report = await this.app.reportRepository.getById(new Uuid(reportId));
    if (!report) throw new DoesNotExist(new Uuid(reportId));

    const anonym = isAnonym === "true";

    report.title = title;
    report.description = description;
    report.category = new ReportCategory(category as CategoryName);
    report.links = Link.linksFrom(input.links || "");
    report.updatedAt = Timestamp.now();
    report.isAnonym = anonym;

    if (input.priority) {
      report.priority = new Priority(+input.priority);
    }

    if (input.assignee) {
      report.assignee = await this.app.userRepository.getById(
        new Uuid(input.assignee),
      );
    } else {
      report.assignee = undefined;
    }

    await this.app.reportService.update(user, report);

    // Attachments anhängen
    const files = getFilesFromInput(input);
    const attachments: Attachment[] = [];

    for (const file of files) {
      const data = await file.arrayBuffer();
      const attachment = await this.app.attachmentService.create(
        report.id,
        user.id,
        file.type,
        Buffer.from(data),
      );

      attachments.push(attachment);
    }

    return this.toReportResponse(report, attachments);
  }

  async updateStatus(request: Request, reportId: Uuid): Promise<Response> {
    const raw = await requestDataToObject(request);
    if (raw.isErr()) {
      throw raw.unwrapErr();
    }

    const body = StatusInput.parse(raw.unwrap());

    const user = this.app.currentUser.unwrap();
    const report = await this.app.reportService.updateStatus(
      reportId,
      user,
      body.status,
    );

    return new Response(
      JSON.stringify(this.toReportResponse(report)),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  private toReportResponse(
    report: Report,
    attachments: Attachment[] = [],
  ): ReportResponse {
    return {
      id: report.id.toString(),
      user_id: report.user.id.toString(),
      user_name: report.displayUserName,
      title: report.title,
      description: report.description,
      category: report.category.toString(),
      status: report.status.toString(),
      attachments: attachments.map((attachment) => attachment.id.toString()),
      created_at: report.createdAt.toUnix(),
      updated_at: report.updatedAt.toUnix(),
    };
  }
}

function getFilesFromInput(input: z.infer<typeof ReportInput>): File[] {
  const attachments = input.attachments ?? [];
  return Array.isArray(attachments) ? attachments : [attachments];
}
