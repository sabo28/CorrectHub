import Report, { IPrimitiveReport } from "../report/report.ts";
import User from "../user/user.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";

export enum ReportLifecycleEventType {
  Creation = "CREATION",
  Update = "UPDATE",
  StatusChange = "STATUS_CHANGE",
}

export interface IPrimitiveReportLifecycleEvent {
  id: string;
  type: ReportLifecycleEventType;
  reportId: string;
  actorId: string;
  actorName: string;
  isAnonymous: boolean;
  oldValues: Partial<IPrimitiveReport>;
  newValues: Partial<IPrimitiveReport>;
  createdAtMillis: number;
}

/**
 * Ein Zustand einer Meldung zu einem bestimmten Zeitpunkt
 */
export default class ReportLifecycleEvent {
  constructor(
    readonly id: Uuid,
    readonly type: ReportLifecycleEventType,
    readonly report: Report,
    readonly actor: User,
    readonly oldValues: Partial<IPrimitiveReport>,
    readonly newValues: Partial<IPrimitiveReport>,
    readonly createdAt: Timestamp,
  ) {}

  toPrimitive(): IPrimitiveReportLifecycleEvent {
    const actorIsAuthor =
      this.actor.id.toString() === this.report.user.id.toString();
    const isAnonymous = this.report.isAnonym && actorIsAuthor;

    return {
      id: this.id.toString(),
      type: this.type,
      reportId: this.report.id.toString(),
      actorId: this.actor.id.toString(),
      actorName: isAnonymous ? "Anonym" : this.actor.username,
      isAnonymous,
      oldValues: this.toRelevantValues(this.oldValues),
      newValues: this.toRelevantValues(this.newValues),
      createdAtMillis: this.createdAt.toUnixMillis(),
    };
  }

  private toRelevantValues(
    values: Partial<IPrimitiveReport>,
  ): Partial<IPrimitiveReport> {
    const cloned = { ...values };

    delete cloned.id;
    delete cloned.userId;
    delete cloned.username, delete cloned.isAnonym;
    delete cloned.createdAtMillis;
    delete cloned.updatedAtMillis;

    if (cloned.assigneeId == null) {
      delete cloned.assigneeId;
      delete cloned.assigneeUsername;
    }

    return cloned;
  }
}
