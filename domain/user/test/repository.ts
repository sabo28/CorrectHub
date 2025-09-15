import User from "../user.ts";
import IUserRepository from "../repository.ts";
import Uuid from "../../value-objects/uuid.ts";
import {
  AlreadyExists,
  DoesNotExist,
  EmailDoesNotExist,
  UserDoesNotExist,
  UsernameAlreadyExists,
} from "../error.ts";
import Email from "../../value-objects/email.ts";
import { Result } from "@utils/result.ts";
import Timestamp from "../../value-objects/timestamp.ts";
import Role from "../role.ts";

type UserTestRepositoryOverrideFunctions = Partial<{
  getById: () => Promise<User>;
  getByUsername: () => Promise<User>;
  getByEmail: () => Promise<User>;
  delete: () => Promise<User>;
  save: () => Promise<User>;
  update: () => Promise<User>;
  getByRoles: () => Promise<User[]>;
}>;

export default class UserTestRepository implements IUserRepository {
  private store: Record<string, User> = {};
  private overrideFunctions: UserTestRepositoryOverrideFunctions;

  constructor(overrideFunctions?: UserTestRepositoryOverrideFunctions) {
    this.overrideFunctions = overrideFunctions ?? {};
  }

  list(
    orderBy: keyof User = "createdAt",
    direction?: boolean,
  ): Promise<User[]> {
    const users = Object.values(this.store).sort((a, b) => {
      const multi = direction ? 1 : -1;
      return a[orderBy].toString().localeCompare(b[orderBy].toString()) * multi;
    });
    return Promise.resolve(users);
  }

  getById(id: Uuid): Promise<User> {
    if (this.overrideFunctions.getById != null) {
      return this.overrideFunctions.getById();
    }

    const user = this.store[id.toString()];

    if (user == null) {
      return Promise.reject(new DoesNotExist(id));
    }

    return Promise.resolve(user);
  }

  getByIds(ids: Uuid[]): Promise<Record<string, User>> {
    const uniqueIds = new Set(ids.map((id) => id.toString()));
    const result: Record<string, User> = {};

    for (const id of Array.from(uniqueIds)) {
      const user = this.store[id];

      if (user == null) {
        continue;
      }

      result[id] = user;
    }

    return Promise.resolve(result);
  }

  getByUsername(username: string): Promise<User> {
    const users = Object.values(this.store);
    const user = users.find((user) => user.username === username);

    if (user == null) {
      return Promise.reject(new UserDoesNotExist(username));
    }

    return Promise.resolve(user);
  }

  getByEmail(email: Email): Promise<User> {
    if (this.overrideFunctions.getByEmail != null) {
      return this.overrideFunctions.getByEmail();
    }

    const users = Object.values(this.store);
    const user = users.find((user) =>
      user.email.toString() === email.toString()
    );

    if (user == null) {
      return Promise.reject(new EmailDoesNotExist(email));
    }

    return Promise.resolve(user);
  }

  delete(_user: User): Promise<User> {
    if (this.overrideFunctions.delete != null) {
      return this.overrideFunctions.delete();
    }

    throw new Error("not implemented");
  }

  async save(user: User): Promise<User> {
    if (this.overrideFunctions.save != null) {
      return this.overrideFunctions.save();
    }

    if (this.store[user.id.toString()]) {
      throw new AlreadyExists(user.id);
    }

    const userByUsername = await Result.from(this.getByUsername(user.username));
    if (userByUsername.isOk()) {
      throw new UsernameAlreadyExists(user.username);
    }
    if (
      userByUsername.isErr() &&
      !(userByUsername.unwrapErr() instanceof UserDoesNotExist)
    ) {
      throw userByUsername.unwrapErr();
    }

    this.store[user.id.toString()] = user;
    return user;
  }

  update(user: User): Promise<User> {
    if (this.overrideFunctions.update != null) {
      return this.overrideFunctions.update();
    }

    if (!this.store[user.id.toString()]) {
      return Promise.reject(new DoesNotExist(user.id));
    }

    user.updatedAt = Timestamp.now();
    this.store[user.id.toString()] = user;

    return Promise.resolve(user);
  }

  getByRoles(roles: Role[]): Promise<User[]> {
    if (this.overrideFunctions.getByRoles != null) {
      return this.overrideFunctions.getByRoles();
    }

    const roleValues = roles.map((r) => r.toString());

    const matchingUsers = Object.values(this.store).filter((user) =>
      roleValues.includes(user.role.toString())
    );

    return Promise.resolve(matchingUsers);
  }
}
