import { reportEventsSchema } from "./schema.ts";
import IReportLifecycleRepository from "@domain/report-lifecycle/repository.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { DatabaseClient } from "./db.ts";
import { eq } from "drizzle-orm";
import ReportLifecycleTransferObject from "./reportLifecycleTransferObject.ts";
import ReportLifecycleEvent from "@domain/report-lifecycle/report-lifecycle-event.ts";
import IReportRepository from "@domain/report/repository.ts";
import IUserRepository from "@domain/user/repository.ts";

export default class ReportLifecycleRepository
  implements IReportLifecycleRepository {
  constructor(
    private readonly db: DatabaseClient,
    private readonly reportRepository: IReportRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async list(reportId: Uuid): Promise<ReportLifecycleEvent[]> {
    const result = await this.db.select().from(reportEventsSchema).where(
      eq(reportEventsSchema.reportId, reportId.toString()),
    );

    if (!result.length) {
      return [];
    }

    const report = await this.reportRepository.getById(reportId);

    const userIds = new Set<Uuid>();
    result.forEach((row) => userIds.add(new Uuid(row.actorId)));
    const users = await this.userRepository.getByIds(Array.from(userIds));

    return result.map((row) =>
      new ReportLifecycleTransferObject(row).toReportLifecycleEvent(
        report,
        users[row.actorId],
      )
    );
  }

  async save(reportState: ReportLifecycleEvent): Promise<ReportLifecycleEvent> {
    await this.db.insert(reportEventsSchema).values(
      ReportLifecycleTransferObject.from(reportState),
    );

    return reportState;
  }
}
