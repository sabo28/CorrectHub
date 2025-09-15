import Email from "@domain/value-objects/email.ts";
import Event from "@domain/event/event.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Report from "../report.ts";
import Status from "../status.ts";
import User from "../../user/user.ts";

export default class ReportStatusChange extends Event {
  readonly report: Report;
  readonly email: Email;
  readonly authorId: Uuid;
  readonly actor: User;
  readonly username: string;
  readonly reportId: Uuid;
  readonly reportTitle: string;
  readonly oldStatus: Status;
  readonly newStatus: Status;

  constructor(actor: User, report: Report, fromStatus: Status) {
    super();

    this.report = report;
    this.actor = actor;

    this.oldStatus = fromStatus;

    this.reportId = report.id;
    this.reportTitle = report.title;
    this.email = report.user.email;
    this.authorId = report.user.id;
    this.username = report.user.username;
    this.newStatus = report.status;
  }
}
