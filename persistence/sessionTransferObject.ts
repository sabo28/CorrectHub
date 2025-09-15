import Uuid from "@domain/value-objects/uuid.ts";
import Session from "@domain/session/session.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";

interface SessionTransferObjectInput {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
}

export default class SessionTransferObject {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly updatedAt: Date;

  constructor(dbSession: SessionTransferObjectInput) {
    this.id = dbSession.id;
    this.userId = dbSession.userId;
    this.createdAt = dbSession.createdAt;
    this.expiresAt = dbSession.expiresAt;
    this.updatedAt = dbSession.updatedAt;
  }

  toSession(): Session {
    return new Session(
      new Uuid(this.id),
      new Uuid(this.userId),
      new Timestamp(this.createdAt),
      new Timestamp(this.expiresAt),
      new Timestamp(this.updatedAt),
    );
  }

  static from(session: Session): SessionTransferObject {
    return new SessionTransferObject({
      id: session.id.toString(),
      userId: session.userId.toString(),
      createdAt: session.createdAt.toDate(),
      expiresAt: session.expiresAt.toDate(),
      updatedAt: session.updatedAt.toDate(),
    });
  }
}
