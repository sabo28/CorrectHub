import ISessionRepository from "../repository.ts";
import Session from "../session.ts";
import Uuid from "../../value-objects/uuid.ts";
import {
  DoesNotExist,
  SessionAlreadyExists,
  SessionWithUserIdDoesNotExist,
} from "../error.ts";

type SessionTestRepositoryOverrideFunctions = Partial<
  Record<keyof SessionTestRepository, () => Promise<Session>>
>;

export default class SessionTestRepository implements ISessionRepository {
  private store: Record<string, Session> = {};
  private overrideFunctions: SessionTestRepositoryOverrideFunctions;

  constructor(overrideFunctions?: SessionTestRepositoryOverrideFunctions) {
    this.overrideFunctions = overrideFunctions ?? {};
  }

  getById(id: Uuid): Promise<Session> {
    if (this.overrideFunctions.getById) {
      return this.overrideFunctions.getById();
    }

    const session = this.store[id.toString()];
    if (!session) {
      return Promise.reject(new DoesNotExist(id));
    }

    return Promise.resolve(session);
  }

  getByUserId(userId: Uuid): Promise<Session> {
    if (this.overrideFunctions.getByUserId) {
      return this.overrideFunctions.getByUserId();
    }

    const sessions = Object.values(this.store);
    const session = sessions.find((session) => session.userId === userId);

    if (!session) {
      return Promise.reject(new SessionWithUserIdDoesNotExist(userId));
    }

    return Promise.resolve(session);
  }

  save(session: Session): Promise<Session> {
    if (this.overrideFunctions.save != null) {
      return this.overrideFunctions.save();
    }

    if (this.store[session.id.toString()]) {
      return Promise.reject(new SessionAlreadyExists(session.id));
    }

    this.store[session.id.toString()] = session;
    return Promise.resolve(session);
  }

  delete(session: Session): Promise<Session> {
    if (this.overrideFunctions.delete != null) {
      return this.overrideFunctions.delete();
    }

    if (!this.store[session.id.toString()]) {
      return Promise.reject(new DoesNotExist(session.id));
    }

    delete this.store[session.id.toString()];

    return Promise.resolve(session);
  }

  update(session: Session): Promise<Session> {
    if (this.overrideFunctions.update != null) {
      return this.overrideFunctions.update();
    }

    if (!this.store[session.id.toString()]) {
      return Promise.reject(new DoesNotExist(session.id));
    }

    this.store[session.id.toString()] = session;
    return Promise.resolve(session);
  }
}
