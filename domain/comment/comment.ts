import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";
import User from "../user/user.ts";

export interface IPrimitiveComment {
  id: string;
  reportId: string;
  username: string;
  text: string;
  createdAtMillis: number;
}

export default class Comment {
  readonly id: Uuid;
  readonly reportId: Uuid;
  readonly user: User;
  isAnonym: boolean;
  text: string;
  readonly createdAt: Timestamp;

  constructor(
    id: Uuid,
    reportId: Uuid,
    user: User,
    isAnonym: boolean,
    text: string,
    createdAt: Timestamp,
  ) {
    if (id == null) throw new Error("Comment: missing id");
    if (reportId == null) throw new Error("Comment: missing reportId");
    if (user == null) throw new Error("Comment: missing user");
    if (isAnonym == null) throw new Error("Comment: missing isAnonym");
    if (text == null) throw new Error("Comment: missing text");
    if (createdAt == null) throw new Error("Comment: missing createdAt");

    this.id = id;
    this.reportId = reportId;
    this.user = user;
    this.isAnonym = isAnonym;
    this.text = text;
    this.createdAt = createdAt;
  }

  get userId(): Uuid {
    return this.user.id;
  }

  get displayUserName(): string {
    return this.isAnonym ? "Anonym" : this.user.username;
  }

  toPrimitive(): IPrimitiveComment {
    return {
      id: this.id.toString(),
      reportId: this.reportId.toString(),
      username: this.displayUserName,
      text: this.text,
      createdAtMillis: this.createdAt.toUnixMillis(),
    };
  }
}
