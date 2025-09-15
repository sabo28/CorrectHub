import Uuid from "@domain/value-objects/uuid.ts";
import User from "./user.ts";
import Email from "../value-objects/email.ts";
import Role from "./role.ts";

export default interface IUserRepository {
  list(orderBy?: string, direction?: boolean): Promise<User[]>;

  getById(id: Uuid): Promise<User>;

  getByIds(ids: Uuid[]): Promise<Record<string, User>>;

  getByEmail(email: Email): Promise<User>;

  getByUsername(username: string): Promise<User>;

  delete(user: User): Promise<User>;

  save(user: User): Promise<User>;

  update(user: User): Promise<User>;

  getByRoles(roles: Role[]): Promise<User[]>;
}
