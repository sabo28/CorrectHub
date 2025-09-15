import Uuid from "@domain/value-objects/uuid.ts";
import Report from "@domain/report/report.ts";
import Status, { StatusName } from "@domain/report/status.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import User from "@domain/user/user.ts";
import ReportCategory, { CategoryName } from "@domain/report/category.ts";
import Priority from "@domain/report/priority.ts";
import Link from "@domain/report/link.ts";

interface ReportTransferObjectInput {
  id: string;
  userId: string;
  assigneeId: string | null;
  isAnonym: boolean;
  title: string;
  description: string;
  category: string | null;
  priority: string | null;
  status: string;
  links: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default class ReportTransferObject implements ReportTransferObjectInput {
  readonly id: string;
  readonly userId: string;
  readonly assigneeId: string | null;
  readonly isAnonym: boolean;
  readonly title: string;
  readonly description: string;
  readonly category: string | null;
  readonly priority: string | null;
  readonly status: string;
  readonly links: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(dbReport: ReportTransferObjectInput) {
    this.id = dbReport.id;
    this.userId = dbReport.userId;
    this.assigneeId = dbReport.assigneeId;
    this.isAnonym = dbReport.isAnonym;
    this.title = dbReport.title;
    this.description = dbReport.description;
    this.category = dbReport.category;
    this.priority = dbReport.priority;
    this.status = dbReport.status;
    this.links = dbReport.links;
    this.createdAt = dbReport.createdAt;
    this.updatedAt = dbReport.updatedAt;
  }

  toReport(user: User, assignee?: User): Report {
    const status = new Status(
      StatusName[this.status as keyof typeof StatusName],
    );

    return new Report(
      new Uuid(this.id),
      user,
      this.isAnonym,
      this.title,
      this.description,
      ReportCategory.from(this.category ?? CategoryName.OTHER),
      new Priority(this.priority ? +this.priority : 20),
      status,
      Link.linksFrom(this.links || ""),
      new Timestamp(this.createdAt),
      new Timestamp(this.updatedAt),
      assignee,
    );
  }

  static from(report: Report): ReportTransferObject {
    return new ReportTransferObject({
      id: report.id.toString(),
      userId: report.user.id.toString(),
      assigneeId: report.assignee?.id.toString() ?? null,
      isAnonym: report.isAnonym,
      title: report.title,
      description: report.description,
      category: report.category.toString(),
      priority: report.priority.value.toString(),
      status: report.status.toString(),
      links: report.links.map((l) => l.toString()).join("\n"),
      createdAt: report.createdAt.toDate(),
      updatedAt: report.updatedAt.toDate(),
    });
  }
}
