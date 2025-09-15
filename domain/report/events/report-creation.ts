import Event from "../../event/event.ts";
import Report from "../report.ts";

export default class ReportCreation extends Event {
  constructor(
    readonly report: Report,
  ) {
    super();
  }
}
