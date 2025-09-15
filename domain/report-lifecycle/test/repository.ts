import IReportLifecycleRepository from "@domain/report-lifecycle/repository.ts";
import ReportLifecycleEvent from "../report-lifecycle-event.ts";
import Uuid from "@domain/value-objects/uuid.ts";

type ReportIdString = string;

export default class ReportLifecycleTestRepository
  implements IReportLifecycleRepository {
  store: Record<ReportIdString, ReportLifecycleEvent[]> = {};

  list(reportId: Uuid): Promise<ReportLifecycleEvent[]> {
    return Promise.resolve(this.store[reportId.toString()] ?? []);
  }

  save(reportEvent: ReportLifecycleEvent): Promise<ReportLifecycleEvent> {
    const reportId = reportEvent.report.id.toString();
    if (this.store[reportId] == null) {
      this.store[reportId] = [];
    }

    this.store[reportId].push(reportEvent);

    return Promise.resolve(reportEvent);
  }
}
