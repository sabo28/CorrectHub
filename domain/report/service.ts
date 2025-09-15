import {
  NoPermissionToUpdateField,
  NoPermissionToUpdateReport,
  NoPermissionToUpdateStatus,
} from "./error.ts";
import Report from "./report.ts";
import Uuid from "../value-objects/uuid.ts";
import Timestamp from "../value-objects/timestamp.ts";
import IReportRepository, { IReportFilter } from "./repository.ts";
import Status, { StatusName } from "./status.ts";
import User from "../user/user.ts";
import ReportCategory from "./category.ts";
import IEventService from "../event/service.ts";
import ReportStatusChange from "./events/report-status-change.ts";
import ReportUpdate from "./events/report-update.ts";
import ReportCreation from "./events/report-creation.ts";
import Priority from "./priority.ts";
import Link from "./link.ts";

const DEFAULT_PRIORITY = 20;

export default interface IReportService {
  create(
    user: User,
    title: string,
    description: string,
    category: ReportCategory,
    isAnonym: boolean,
    priority?: number,
    links?: string,
    assignee?: User,
  ): Promise<Report>;

  findById(
    id: Uuid,
  ): Promise<Report>;

  update(currentUser: User, report: Report): Promise<Report>;

  updateStatus(
    id: Uuid,
    currentUser: User,
    newStatus: StatusName,
  ): Promise<Report>;

  list(
    currentUser: User,
    filter?: Partial<IReportFilter>,
    orderBy?: keyof Report,
    sortOrder?: "asc" | "desc",
  ): Promise<Report[]>;
}

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly eventService: IEventService,
  ) {}

  async create(
    user: User,
    title: string,
    description: string,
    category: ReportCategory,
    isAnonym: boolean,
    priority?: number,
    links: string = "",
    assignee?: User,
  ): Promise<Report> {
    const id = Uuid.newRandom();
    const now = Timestamp.now();

    if (priority != null && !user.permissions.canChangePriority()) {
      throw new NoPermissionToUpdateField(id, "priority");
    }

    if (assignee && !user.permissions.canChangeAssignee()) {
      throw new NoPermissionToUpdateField(id, "assignee");
    }

    const report = new Report(
      id,
      user,
      isAnonym,
      title,
      description,
      category,
      new Priority(priority ?? DEFAULT_PRIORITY),
      new Status(StatusName.NEW),
      Link.linksFrom(links),
      now,
      now,
      assignee,
    );

    await this.reportRepository.create(report);
    await this.eventService.publish(
      new ReportCreation(report),
    );
    return report;
  }

  async findById(id: Uuid): Promise<Report> {
    return await this.reportRepository.getById(id);
  }

  async update(currentUser: User, report: Report): Promise<Report> {
    const existingReport = await this.reportRepository.getById(report.id);
    return this.updateReport(currentUser, existingReport, report);
  }

  async updateStatus(
    id: Uuid,
    currentUser: User,
    newStatus: StatusName,
  ): Promise<Report> {
    const report = await this.reportRepository.getById(id);

    if (report.status.value === newStatus) {
      return report;
    }

    const newReport = report.updateStatus(new Status(newStatus));
    return this.updateReport(currentUser, report, newReport);
  }

  list(
    currentUser: User,
    filter: Partial<IReportFilter>,
    orderBy?: keyof Report,
    sortOrder?: "asc" | "desc",
  ): Promise<Report[]> {
    if (!currentUser.permissions.canViewAllReports()) {
      return this.reportRepository.list(
        {
          ...filter,
          userId: currentUser.id,
        },
        orderBy,
        sortOrder,
      );
    }

    return this.reportRepository.list(
      filter,
      orderBy,
      sortOrder,
    );
  }

  private async updateReport(
    currentUser: User,
    existingReport: Report,
    newReport: Report,
  ): Promise<Report> {
    const statusChanged =
      existingReport.status.value !== newReport.status.value;
    const priorityChanged =
      existingReport.priority.value !== newReport.priority.value;
    const assigneeChanged =
      existingReport.assignee?.id !== newReport.assignee?.id;
    const reportChanged = this.reportChanged(existingReport, newReport);

    if (
      reportChanged &&
      !currentUser.permissions.canEditReport(existingReport.user.id)
    ) {
      throw new NoPermissionToUpdateReport(newReport.id);
    }

    if (priorityChanged && !currentUser.permissions.canChangePriority()) {
      throw new NoPermissionToUpdateField(existingReport.id, "priority");
    }

    if (assigneeChanged && !currentUser.permissions.canChangeAssignee()) {
      throw new NoPermissionToUpdateField(existingReport.id, "assignee");
    }

    if (
      statusChanged &&
      !currentUser.permissions.canChangeStatus()
    ) {
      throw new NoPermissionToUpdateStatus(newReport.id);
    }

    const cloned = existingReport.clone();
    cloned.title = newReport.title;
    cloned.description = newReport.description;
    cloned.category = newReport.category;
    cloned.priority = newReport.priority;
    cloned.isAnonym = newReport.isAnonym;
    cloned.status = newReport.status;
    cloned.links = newReport.links;
    cloned.assignee = newReport.assignee;
    cloned.updatedAt = Timestamp.now();

    const updatedReport = await this.reportRepository.update(cloned);

    if (statusChanged) {
      await this.publishStatusChange(
        currentUser,
        updatedReport,
        existingReport.status,
      );
    }

    if (reportChanged) {
      await this.publishReportChange(
        currentUser,
        existingReport,
        updatedReport,
      );
    }

    return Promise.resolve(updatedReport);
  }

  private reportChanged(oldReport: Report, newReport: Report): boolean {
    const omitKeys: (keyof Report)[] = [
      "id",
      "createdAt",
      "updatedAt",
      "status",
    ];

    for (const key of Object.keys(oldReport) as (keyof Report)[]) {
      if (omitKeys.includes(key) || typeof oldReport[key] === "function") {
        continue;
      }

      if (oldReport[key]?.toString() !== newReport[key]?.toString()) {
        return true;
      }
    }

    return false;
  }

  private publishStatusChange(
    currentUser: User,
    updatedReport: Report,
    fromStatus: Status,
  ): Promise<void> {
    return this.eventService.publish(
      new ReportStatusChange(currentUser, updatedReport, fromStatus),
    );
  }

  private publishReportChange(
    currentUser: User,
    oldReport: Report,
    newReport: Report,
  ) {
    return this.eventService.publish(
      new ReportUpdate(currentUser, oldReport, newReport),
    );
  }
}
