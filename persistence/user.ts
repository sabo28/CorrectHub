import UserTransferObject from "./userTransferObject.ts";
import {
  DoesNotExist,
  EmailDoesNotExist,
  UserDoesNotExist,
  UsernameAlreadyExists,
} from "@domain/user/error.ts";
import IUserRepository from "@domain/user/repository.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import User from "@domain/user/user.ts";
import Email from "@domain/value-objects/email.ts";
import { userSchema } from "./schema.ts";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { DatabaseError } from "pg";
import { DatabaseClient } from "./db.ts";
import { Result } from "@utils/result.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import Role from "@domain/user/role.ts";

type UserColumn = keyof typeof userSchema;

export default class UserRepository implements IUserRepository {
  constructor(private readonly db: DatabaseClient) {}

  async list(orderBy?: string, direction?: boolean): Promise<User[]> {
    const orderField: UserColumn = (orderBy ?? "createdAt") as UserColumn;
    const column = userSchema[orderField] ?? userSchema.createdAt;
    // deno-lint-ignore no-explicit-any
    const order = direction ? asc(column as any) : desc(column as any);

    const result = await this.db.select().from(userSchema).orderBy(
      order,
    );

    if (!result.length) {
      return [];
    }

    return result.map((row) => new UserTransferObject(row).toUser());
  }

  async getById(id: Uuid): Promise<User> {
    const result = await this.db.select().from(userSchema).where(
      eq(userSchema.id, id.toString()),
    );

    if (result.length === 0) {
      throw new DoesNotExist(id);
    }

    return new UserTransferObject(result[0]).toUser();
  }

  async getByIds(ids: Uuid[]): Promise<Record<string, User>> {
    const uniqueIds = new Set(ids.map((id) => id.toString()));
    const output: Record<string, User> = {};

    const result = await this.db.select().from(userSchema).where(
      inArray(userSchema.id, Array.from(uniqueIds)),
    );

    for (const row of result) {
      output[row.id] = new UserTransferObject(row).toUser();
    }

    return output;
  }

  async getByEmail(email: Email): Promise<User> {
    const result = await this.db.select().from(userSchema).where(
      eq(userSchema.email, email.toString()),
    );

    if (result.length === 0) {
      throw new EmailDoesNotExist(email);
    }

    return new UserTransferObject(result[0]).toUser();
  }

  async getByUsername(username: string): Promise<User> {
    const result = await this.db.select().from(userSchema).where(
      eq(userSchema.username, username),
    );

    if (result.length === 0) {
      throw new UserDoesNotExist(username);
    }

    return new UserTransferObject(result[0]).toUser();
  }

  delete(_user: User): Promise<User> {
    return Promise.reject(new Error("not implemented"));
  }

  async save(user: User): Promise<User> {
    const result = await Result.from(
      () =>
        this.db.insert(userSchema).values(
          UserTransferObject.from(user),
        ),
    );

    if (result.isErr()) {
      const err = result.unwrapErr();

      if (
        err instanceof DatabaseError &&
        (err as DatabaseError).code === "23505" &&
        (err as DatabaseError).constraint === "user_username_unique"
      ) {
        throw new UsernameAlreadyExists(user.username);
      }

      throw err;
    }

    return user;
  }

  async update(user: User): Promise<User> {
    user.updatedAt = Timestamp.now();

    const result = await this.db.update(userSchema)
      .set(
        UserTransferObject.from(user),
      )
      .where(eq(userSchema.id, user.id.toString()))
      .returning();

    if (!result.length) {
      throw new DoesNotExist(user.id);
    }

    return new UserTransferObject(result[0]).toUser();
  }

  async getByRoles(roles: Role[]): Promise<User[]> {
    const roleValues = roles.map((role) => role.value);

    const results = await this.db
      .select()
      .from(userSchema)
      .where(inArray(userSchema.role, roleValues));

    return results.map((row) => new UserTransferObject(row).toUser());
  }
}
