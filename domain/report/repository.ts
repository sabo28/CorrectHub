import Report from "./report.ts";
import Uuid from "../value-objects/uuid.ts";
import User from "../user/user.ts";

export interface IReportFilter {
  title: string;
  description: string;
  userId: Uuid;
}

export default interface IReportRepository {
  create(report: Report): Promise<Report>;

  getById(id: Uuid): Promise<Report>;

  getByUser(user: User): Promise<Report>;

  update(report: Report): Promise<Report>;

  delete(report: Report): Promise<Report>;

  list(
    filter?: Partial<IReportFilter>,
    orderBy?: keyof Report,
    sortOrder?: "asc" | "desc",
  ): Promise<Report[]>;
}
