import Uuid from "../value-objects/uuid.ts";
import ReportLifecycleEvent from "./report-lifecycle-event.ts";

export default interface IReportLifecycleRepository {
  list(reportId: Uuid): Promise<ReportLifecycleEvent[]>;
  save(reportState: ReportLifecycleEvent): Promise<ReportLifecycleEvent>;
}
