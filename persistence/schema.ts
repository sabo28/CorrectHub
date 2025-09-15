import {
  boolean,
  customType,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { Buffer } from "node:buffer";

const blob = customType<{ data: Buffer; default: false }>({
  dataType() {
    return "bytea";
  },
});

export const userSchema = pgTable("user", {
  id: uuid().primaryKey().notNull(),
  username: text().notNull().unique(),
  email: text().unique().notNull(),
  emailVerified: boolean().notNull(),
  verificationCode: text().notNull(),
  password: text().notNull(),
  role: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const sessionSchema = pgTable("session", {
  id: uuid().primaryKey().notNull(),
  userId: uuid().notNull().references(() => userSchema.id),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const reportSchema = pgTable("report", {
  id: uuid().primaryKey(),
  userId: uuid().notNull().references(() => userSchema.id),
  isAnonym: boolean().notNull().default(false),
  title: text().notNull(),
  description: text().notNull(),
  category: text(),
  assigneeId: uuid().references(() => userSchema.id),
  priority: numeric(),
  status: text().notNull(),
  links: text(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const attachmentSchema = pgTable("attachment", {
  id: uuid().primaryKey().notNull(),
  reportId: uuid().notNull().references(() => reportSchema.id),
  createdBy: uuid().notNull().references(() => userSchema.id),
  mime: text().notNull(),
  data: blob().notNull(),
  preview: blob().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const commentSchema = pgTable("comment", {
  id: uuid().primaryKey().notNull(),
  reportId: uuid().notNull().references(() => reportSchema.id),
  userId: uuid().notNull().references(() => userSchema.id),
  isAnonym: boolean().notNull().default(false),
  text: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const reportEventsSchema = pgTable("report_events", {
  id: uuid().primaryKey().notNull(),
  type: text().notNull(),
  reportId: uuid().notNull().references(() => reportSchema.id),
  actorId: uuid().notNull().references(() => userSchema.id),
  oldValues: jsonb().notNull(),
  newValues: jsonb().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
}, (table) => [
  index("report_event_report_id_index").on(table.reportId),
  index("report_event_created_at_index").on(table.createdAt),
]);

export const passwordResetTokenSchema = pgTable("password_reset_tokens", {
  id: uuid().primaryKey().notNull(),
  userId: uuid().notNull().references(() => userSchema.id),
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp().notNull(),
});
