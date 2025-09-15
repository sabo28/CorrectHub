import Report, { IPrimitiveReport } from "../report/report.ts";
import User from "../user/user.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";
import ReportLifecycleEvent, {
  ReportLifecycleEventType,
} from "./report-lifecycle-event.ts";
import IReportLifecycleRepository from "./repository.ts";

export default class ReportLifecycleService {
  constructor(
    private readonly repository: IReportLifecycleRepository,
  ) {}

  list(reportId: Uuid): Promise<ReportLifecycleEvent[]> {
    return this.repository.list(reportId);
  }

  save(
    report: Report,
    actor: User,
    type: ReportLifecycleEventType,
    oldValues: Partial<IPrimitiveReport>,
    newValues: Partial<IPrimitiveReport>,
  ): Promise<ReportLifecycleEvent> {
    const state = new ReportLifecycleEvent(
      Uuid.newRandom(),
      type,
      report,
      actor,
      oldValues,
      newValues,
      Timestamp.now(),
    );
    return this.repository.save(state);
  }
}
