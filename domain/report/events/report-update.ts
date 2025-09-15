import Event from "../../event/event.ts";
import User from "../../user/user.ts";
import Report, { IPrimitiveReport } from "../report.ts";

type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export default class ReportUpdate extends Event {
  readonly report: Report;
  readonly oldReportDiff: Partial<IPrimitiveReport>;
  readonly newReportDiff: Partial<IPrimitiveReport>;

  constructor(
    readonly actor: User,
    oldReport: Report,
    newReport: Report,
  ) {
    super();

    this.report = newReport;

    const oldPrimitiveReport = oldReport.toPrimitive();
    const newPrimitiveReport = newReport.toPrimitive();

    const oldDiffValues: Partial<Writable<IPrimitiveReport>> = {};
    const newDiffValues: Partial<Writable<IPrimitiveReport>> = {};

    const skipFields = ["updatedAtMillis"];

    const keys = Object.keys(oldPrimitiveReport) as (keyof IPrimitiveReport)[];
    for (const key of keys) {
      if (
        typeof oldPrimitiveReport[key] === "function" ||
        skipFields.includes(key)
      ) {
        continue;
      }

      const hasChanged = JSON.stringify(oldPrimitiveReport[key]) !==
        JSON.stringify(newPrimitiveReport[key]);
      if (hasChanged) {
        (oldDiffValues[key] as unknown) = oldPrimitiveReport[key];
        (newDiffValues[key] as unknown) = newPrimitiveReport[key];
      }
    }

    this.oldReportDiff = oldDiffValues;
    this.newReportDiff = newDiffValues;
  }
}
