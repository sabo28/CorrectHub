import Uuid from "../value-objects/uuid.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Status, { StatusName } from "./status.ts";
import User from "../user/user.ts";
import ReportCategory from "./category.ts";
import Priority from "./priority.ts";
import Link from "./link.ts";

export interface IPrimitiveReport {
  id: string;
  userId: string;
  username: string;
  assigneeId?: string;
  assigneeUsername?: string;
  isAnonym: boolean;
  title: string;
  description: string;
  category: string;
  priority: number;
  status: StatusName;
  links: string[];
  createdAtMillis: number;
  updatedAtMillis: number;
}

export default class Report {
  readonly id: Uuid;
  user: User;
  assignee?: User;
  isAnonym: boolean;
  title: string;
  description: string;
  category: ReportCategory;
  priority: Priority;
  status: Status;
  links: Link[];
  readonly createdAt: Timestamp;
  updatedAt: Timestamp;

  constructor(
    id: Uuid,
    user: User,
    isAnonym: boolean,
    title: string,
    description: string,
    category: ReportCategory,
    priority: Priority,
    status: Status,
    links: Link[],
    createdAt: Timestamp,
    updatedAt: Timestamp,
    assignee?: User,
  ) {
    if (id == null) throw new Error("Report: missing id");
    if (user == null) throw new Error("Report: missing user");
    if (isAnonym == null) throw new Error("Report: missing isAnonym");
    if (title == null) throw new Error("Report: missing title");
    if (description == null) throw new Error("Report: missing description");
    if (category == null) throw new Error("Report: missing category");
    if (priority == null) throw new Error("Report: missing priority");
    if (status == null) throw new Error("Report: missing status");
    if (links == null) throw new Error("Report: missing links");
    if (createdAt == null) throw new Error("Report: missing createdAt");
    if (updatedAt == null) throw new Error("Report: missing updatedAt");

    this.id = id;
    this.user = user;
    this.assignee = assignee;
    this.isAnonym = isAnonym;
    this.title = title;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.status = status;
    this.links = links;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get displayUserName(): string {
    return this.isAnonym ? "Anonymous" : this.user.username;
  }

  clone(): Report {
    return new Report(
      this.id,
      this.user,
      this.isAnonym,
      this.title,
      this.description,
      this.category,
      this.priority,
      this.status,
      this.links,
      this.createdAt,
      this.updatedAt,
      this.assignee,
    );
  }

  updateStatus(newStatus: Status): Report {
    const cloned = this.clone();
    cloned.status = newStatus;
    cloned.updatedAt = Timestamp.now();
    return cloned;
  }

  toPrimitive(): IPrimitiveReport {
    return {
      id: this.id.toString(),
      userId: this.user.id.toString(),
      username: this.isAnonym ? "Anonym" : this.user.username,
      assigneeId: this.assignee?.id.toString(),
      assigneeUsername: this.assignee?.username,
      isAnonym: this.isAnonym,
      title: this.title,
      description: this.description,
      category: this.category.toString(),
      priority: this.priority.value,
      status: this.status.value,
      links: this.links.map((link) => link.toString()),
      createdAtMillis: this.createdAt.toUnixMillis(),
      updatedAtMillis: this.updatedAt.toUnixMillis(),
    };
  }

  static fieldToPrimitiveMap(
    field: keyof Report,
  ): keyof IPrimitiveReport | undefined {
    switch (field) {
      case "id":
        return "id";
      case "user":
        return "username";
      case "assignee":
        return "assigneeUsername";
      case "isAnonym":
        return "isAnonym";
      case "title":
        return "title";
      case "description":
        return "description";
      case "category":
        return "category";
      case "priority":
        return "priority";
      case "status":
        return "status";
      case "links":
        return "links";
      case "createdAt":
        return "createdAtMillis";
      case "updatedAt":
        return "updatedAtMillis";
    }
  }

  static primitiveToFieldMap(
    primitiveField: keyof IPrimitiveReport,
  ): keyof Report | undefined {
    switch (primitiveField) {
      case "id":
        return "id";
      case "userId":
        return "user";
      case "username":
        return "user";
      case "assigneeId":
        return "assignee";
      case "assigneeUsername":
        return "assignee";
      case "isAnonym":
        return "isAnonym";
      case "title":
        return "title";
      case "description":
        return "description";
      case "category":
        return "category";
      case "priority":
        return "priority";
      case "status":
        return "status";
      case "links":
        return "links";
      case "createdAtMillis":
        return "createdAt";
      case "updatedAtMillis":
        return "updatedAt";
    }
  }
}
