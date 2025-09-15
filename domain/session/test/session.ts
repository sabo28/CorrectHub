import Session from "../session.ts";
import Timestamp, { TimeUnit } from "../../value-objects/timestamp.ts";
import Uuid from "../../value-objects/uuid.ts";

export function randomSession(userId?: Uuid): Session {
  const id = Uuid.newRandom();
  const user = userId ?? Uuid.newRandom();
  const createdAt = Timestamp.now();
  const expiresAt = Timestamp.in(1, TimeUnit.HOURS);

  return new Session(id, user, createdAt, expiresAt, createdAt);
}
