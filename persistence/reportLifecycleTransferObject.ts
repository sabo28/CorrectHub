import { ReportLifecycleEventType } from "@domain/report-lifecycle/report-lifecycle-event.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Report, { IPrimitiveReport } from "@domain/report/report.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import ReportLifecycleEvent from "@domain/report-lifecycle/report-lifecycle-event.ts";
import User from "@domain/user/user.ts";

interface ReportLifecycleTransferObjectInput {
  id: string;
  type: string;
  reportId: string;
  actorId: string;
  oldValues: unknown;
  newValues: unknown;
  createdAt: Date;
}

export default class ReportLifecycleTransferObject {
  readonly id: string;
  readonly type: string;
  readonly reportId: string;
  readonly actorId: string;
  readonly oldValues: Partial<IPrimitiveReport>;
  readonly newValues: Partial<IPrimitiveReport>;
  readonly createdAt: Date;

  constructor(dbResult: ReportLifecycleTransferObjectInput) {
    this.id = dbResult.id;
    this.type = dbResult.type;
    this.reportId = dbResult.reportId;
    this.actorId = dbResult.actorId;
    this.oldValues = dbResult.oldValues as Partial<IPrimitiveReport>;
    this.newValues = dbResult.newValues as Partial<IPrimitiveReport>;
    this.createdAt = dbResult.createdAt;
  }

  toReportLifecycleEvent(report: Report, actor: User): ReportLifecycleEvent {
    if (report == null) {
      throw new Error("toReportLifecycleEvent missing 'report' object");
    }

    if (actor == null) {
      throw new Error("toReportLifecycleEvent missing 'actor' object");
    }

    return new ReportLifecycleEvent(
      new Uuid(this.id),
      this.type as ReportLifecycleEventType,
      report,
      actor,
      this.oldValues,
      this.newValues,
      new Timestamp(this.createdAt),
    );
  }

  static from(
    reportEvent: ReportLifecycleEvent,
  ): ReportLifecycleTransferObject {
    return new ReportLifecycleTransferObject({
      id: reportEvent.id.toString(),
      type: reportEvent.type,
      reportId: reportEvent.report.id.toString(),
      actorId: reportEvent.actor.id.toString(),
      oldValues: reportEvent.oldValues,
      newValues: reportEvent.newValues,
      createdAt: reportEvent.createdAt.toDate(),
    });
  }
}
