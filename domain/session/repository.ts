import Uuid from "@domain/value-objects/uuid.ts";
import Session from "./session.ts";

export default interface ISessionRepository {
  getById(id: Uuid): Promise<Session>;

  getByUserId(userId: Uuid): Promise<Session>;

  delete(session: Session): Promise<Session>;

  save(session: Session): Promise<Session>;

  update(session: Session): Promise<Session>;
}
