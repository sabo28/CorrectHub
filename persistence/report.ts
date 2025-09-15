import ReportTransferObject from "./reportTransferObject.ts";
import {
  ReportDoesNotExist,
  ReportWithUserIdDoesNotExist,
} from "./../domain/report/error.ts";
import IReportRepository, { IReportFilter } from "@domain/report/repository.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Report from "@domain/report/report.ts";
import { reportSchema } from "./schema.ts";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { DatabaseClient } from "./db.ts";
import User from "@domain/user/user.ts";
import IUserRepository from "@domain/user/repository.ts";

type ReportColumn = keyof typeof reportSchema;

export default class ReportRepository implements IReportRepository {
  constructor(
    private readonly db: DatabaseClient,
    private readonly userRepository: IUserRepository,
  ) {}

  async getById(id: Uuid): Promise<Report> {
    const result = await this.db
      .select()
      .from(reportSchema)
      .where(eq(reportSchema.id, id.toString()));

    if (result.length === 0) {
      throw new ReportDoesNotExist(id);
    }

    const row = result[0];
    const user = await this.userRepository.getById(new Uuid(row.userId));
    const assignee = row.assigneeId
      ? await this.userRepository.getById(new Uuid(row.assigneeId))
      : undefined;

    return new ReportTransferObject(row).toReport(user, assignee);
  }

  async getByUser(user: User): Promise<Report> {
    const result = await this.db.select().from(reportSchema).where(
      eq(reportSchema.userId, user.id.toString()),
    );

    if (result.length === 0) {
      throw new ReportWithUserIdDoesNotExist(user.id);
    }

    return new ReportTransferObject(result[0]).toReport(user);
  }

  delete(_Report: Report): Promise<Report> {
    return Promise.reject(new Error("not implemented"));
  }

  async create(Report: Report): Promise<Report> {
    await this.db.insert(reportSchema).values(
      ReportTransferObject.from(Report),
    );
    return Report;
  }

  async update(Report: Report): Promise<Report> {
    await this.db
      .update(reportSchema)
      .set(ReportTransferObject.from(Report))
      .where(eq(reportSchema.id, Report.id.toString()));

    return Report;
  }

  async list(
    filter?: Partial<IReportFilter>,
    orderBy?: keyof Report,
    sortOrder?: "asc" | "desc",
  ): Promise<Report[]> {
    const orderField = (orderBy ?? "createdAt") as ReportColumn;
    const column = reportSchema[orderField] ?? reportSchema.createdAt;
    const order = sortOrder === "asc"
      // deno-lint-ignore no-explicit-any
      ? asc(column as any)
      // deno-lint-ignore no-explicit-any
      : desc(column as any);

    const query = this.db.select().from(reportSchema).orderBy(order);
    const filters = [
      filter?.title
        ? ilike(reportSchema.title, `%${filter.title.toLowerCase()}%`)
        : undefined,
      filter?.description
        ? ilike(
          reportSchema.description,
          `%${filter.description.toLowerCase()}%`,
        )
        : undefined,
    ].filter(Boolean);

    if (filter?.userId) {
      query.where(
        and(
          eq(reportSchema.userId, filter.userId.toString()),
          or(...filters),
        ),
      );
    } else {
      query.where(or(...filters));
    }

    const userIds = new Set<string>();
    const result = await query;

    result.forEach((row) => {
      userIds.add(row.userId);
      row.assigneeId && userIds.add(row.assigneeId);
    });

    const users = await this.userRepository.getByIds(
      Array.from(userIds).map((id) => new Uuid(id)),
    );

    return result.map((row) =>
      new ReportTransferObject(row).toReport(
        users[row.userId],
        row.assigneeId != null ? users[row.assigneeId] : undefined,
      )
    );
  }
}
