import IReportRepository, { IReportFilter } from "../repository.ts";
import Report from "../report.ts";
import Uuid from "../../value-objects/uuid.ts";
import {
  ReportAlreadyExists,
  ReportDoesNotExist,
  ReportWithUserIdDoesNotExist,
} from "../error.ts";
import User from "../../user/user.ts";

type ReportTestRepositoryOverrideFunctions = Partial<
  Record<keyof ReportTestRepository, () => Promise<Report>>
>;

export default class ReportTestRepository implements IReportRepository {
  private store: Record<string, Report> = {};
  private overrideFunctions: ReportTestRepositoryOverrideFunctions;

  constructor(overrideFunctions?: ReportTestRepositoryOverrideFunctions) {
    this.overrideFunctions = overrideFunctions ?? {};
  }

  getById(id: Uuid): Promise<Report> {
    if (this.overrideFunctions.getById) {
      return this.overrideFunctions.getById();
    }

    const report = this.store[id.toString()];
    if (!report) {
      return Promise.reject(new ReportDoesNotExist(id));
    }

    // Clone instance
    return Promise.resolve(
      Object.assign(Object.create(Object.getPrototypeOf(report)), report),
    );
  }

  getByUser(user: User): Promise<Report> {
    if (this.overrideFunctions.getByUser) {
      return this.overrideFunctions.getByUser();
    }

    const reports = Object.values(this.store);
    const report = reports.find((Report) => Report.user.id === user.id);

    if (!report) {
      return Promise.reject(new ReportWithUserIdDoesNotExist(user.id));
    }

    // Clone instance
    return Promise.resolve(
      Object.assign(Object.create(Object.getPrototypeOf(report)), report),
    );
  }

  create(report: Report): Promise<Report> {
    if (this.overrideFunctions.create != null) {
      return this.overrideFunctions.create();
    }

    if (this.store[report.id.toString()]) {
      return Promise.reject(new ReportAlreadyExists(report.id));
    }

    // Clone instance
    const clonedReport = Object.assign(
      Object.create(Object.getPrototypeOf(report)),
      report,
    );
    this.store[report.id.toString()] = clonedReport;

    return clonedReport;
  }

  delete(_Report: Report): Promise<Report> {
    if (this.overrideFunctions.delete != null) {
      return this.overrideFunctions.delete();
    }

    throw new Error("Delete operation not implemented in test repository");
  }

  update(report: Report): Promise<Report> {
    if (this.overrideFunctions.update != null) {
      return this.overrideFunctions.update();
    }

    if (!this.store[report.id.toString()]) {
      return Promise.reject(new ReportDoesNotExist(report.id));
    }

    // Clone instance
    const clonedReport = Object.assign(
      Object.create(Object.getPrototypeOf(report)),
      report,
    );
    this.store[report.id.toString()] = clonedReport;

    return Promise.resolve(clonedReport);
  }

  list(
    filter?: Partial<IReportFilter>,
    orderBy?: keyof Report,
    sortOrder?: "asc" | "desc",
  ): Promise<Report[]> {
    const result = Object.values(this.store).filter((report) => {
      if (!filter) {
        return true;
      }

      if (
        filter.userId && report.user.id.toString() === filter.userId.toString()
      ) {
        return true;
      }

      if (
        filter.title &&
        report.title.toLowerCase().includes(filter.title.toLowerCase())
      ) {
        return true;
      }

      if (
        filter.description &&
        report.description.toLowerCase().includes(
          filter.description.toLowerCase(),
        )
      ) {
        return true;
      }

      return false;
    });

    if (orderBy) {
      result.sort((a, b) => {
        const multi = sortOrder === "asc" ? 1 : -1;
        const s =
          a[orderBy]?.toString().localeCompare(b[orderBy]?.toString() ?? "") ??
            0;
        return s * multi;
      });
    }

    return Promise.resolve(result);
  }
}
