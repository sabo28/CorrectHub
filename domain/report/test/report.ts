import ReportCategory, { CategoryName } from "@domain/report/category.ts";
import { randomUser } from "@domain/user/test/user.ts";
import Report, { IPrimitiveReport } from "../report.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Timestamp from "../../value-objects/timestamp.ts";
import Status, { StatusName } from "../status.ts";
import Priority from "../priority.ts";
import Link from "../link.ts";

type RandomReportOptions = Partial<Omit<IPrimitiveReport, "user">>;

const DICTIONARY = [
  "typo",
  "error",
  "omission",
  "inaccuracy",
  "redundancy",
  "misstatement",
  "misspelling",
  "grammatical",
  "punctuation",
  "formatting",
  "ambiguity",
  "inconsistency",
  "overstatement",
  "understatement",
  "contradiction",
  "mislabeling",
  "misalignment",
  "malformation",
  "imprecision",
  "slip",
];

export default function randomReport(
  options: RandomReportOptions = {},
): Report {
  const user = randomUser();
  const assignee = options.assigneeId || options.assigneeUsername
    ? randomUser({
      id: options.assigneeId,
      username: options.assigneeUsername,
    })
    : undefined;

  return new Report(
    options.id ? new Uuid(options.id) : Uuid.newRandom(),
    user,
    options.isAnonym ?? false,
    options.title ?? randomWords(4),
    options.description ?? randomWords(10),
    options.category
      ? new ReportCategory(options.category as CategoryName)
      : ReportCategory.ContentError,
    options.priority ? new Priority(options.priority) : new Priority(20),
    options.status ? new Status(options.status) : new Status(StatusName.NEW),
    Link.fromArray(options.links ?? ["https://example.com"]),
    options.createdAtMillis
      ? Timestamp.fromUnixMillis(options.createdAtMillis)
      : Timestamp.now(),
    options.updatedAtMillis
      ? Timestamp.fromUnixMillis(options.updatedAtMillis)
      : Timestamp.now(),
    assignee,
  );
}

function randomWords(count: number): string {
  if (count <= 0) return "";

  // Shuffle the array (Fisher-Yates)
  const shuffled = [...DICTIONARY];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Slice the first `count` words and join them into a string
  return shuffled.slice(0, count).join(" ");
}
