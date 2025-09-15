import SessionTransferObject from "./sessionTransferObject.ts";
import ISessionRepository from "@domain/session/repository.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Session from "@domain/session/session.ts";
import { sessionSchema } from "./schema.ts";
import { eq } from "drizzle-orm";
import { DatabaseClient } from "./db.ts";
import {
  DoesNotExist,
  SessionWithUserIdDoesNotExist,
} from "@domain/session/error.ts";

export default class SessionRepository implements ISessionRepository {
  constructor(private readonly db: DatabaseClient) {}

  async getById(id: Uuid): Promise<Session> {
    const result = await this.db.select().from(sessionSchema).where(
      eq(sessionSchema.id, id.toString()),
    );

    if (result.length === 0) {
      throw new DoesNotExist(id);
    }

    return new SessionTransferObject(result[0]).toSession();
  }

  async getByUserId(userId: Uuid): Promise<Session> {
    const result = await this.db.select().from(sessionSchema).where(
      eq(sessionSchema.userId, userId.toString()),
    );

    if (result.length === 0) {
      throw new SessionWithUserIdDoesNotExist(userId);
    }

    return new SessionTransferObject(result[0]).toSession();
  }

  async delete(session: Session): Promise<Session> {
    await this.getById(session.id);

    await this.db.delete(sessionSchema).where(
      eq(sessionSchema.id, session.id.toString()),
    );

    return session;
  }

  async save(session: Session): Promise<Session> {
    await this.db.insert(sessionSchema).values(
      SessionTransferObject.from(session),
    );
    return session;
  }

  async update(session: Session): Promise<Session> {
    await this.db
      .update(sessionSchema)
      .set({
        expiresAt: session.expiresAt.toDate(),
        updatedAt: session.updatedAt.toDate(),
      })
      .where(eq(sessionSchema.id, session.id.toString()));
    return session;
  }
}
