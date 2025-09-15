import Uuid from "../value-objects/uuid.ts";
import Timestamp, { TimeUnit } from "../value-objects/timestamp.ts";

export default class Session {
  readonly id: Uuid;
  userId: Uuid;
  readonly createdAt: Timestamp;
  expiresAt: Timestamp;
  updatedAt: Timestamp;

  constructor(
    id: Uuid,
    userId: Uuid,
    createdAt: Timestamp,
    expiresAt: Timestamp,
    updatedAt: Timestamp,
  ) {
    if (id == null) {
      throw new Error("User: missing id");
    }

    if (userId == null) {
      throw new Error("User: missing userId");
    }

    if (createdAt == null) {
      throw new Error("User: missing createdAt");
    }

    if (expiresAt == null) {
      throw new Error("User: missing expiresAt");
    }

    if (updatedAt == null) {
      throw new Error("User: missing updatedAt");
    }

    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.updatedAt = updatedAt;
  }

  static newWith(userId: Uuid) {
    const now = Timestamp.now();
    return new Session(
      Uuid.newRandom(),
      userId,
      now,
      Timestamp.in(30, TimeUnit.MINUTES),
      now,
    );
  }

  get isActive(): boolean {
    return Timestamp.now().toUnix() < this.expiresAt.toUnix();
  }
}
