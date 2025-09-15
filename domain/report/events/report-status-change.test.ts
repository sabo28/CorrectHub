import { randomUser } from "@domain/user/test/user.ts";
import Status from "../status.ts";
import ReportStatusChange from "./report-status-change.ts";
import { assertEquals } from "$std/assert/mod.ts";
import randomReport from "../test/report.ts";

Deno.test("new StatusChange correctly extracts information", () => {
  const actingUser = randomUser();
  const report = randomReport();

  const event = new ReportStatusChange(actingUser, report, Status.New);
  assertEquals(event.actor.id.toString(), actingUser.id.toString());
  assertEquals(event.authorId.toString(), report.user.id.toString());
  assertEquals(event.email.toString(), report.user.email.toString());
  assertEquals(event.newStatus.toString(), report.status.toString());
  assertEquals(event.oldStatus.toString(), Status.New.toString());
  assertEquals(event.reportId.toString(), report.id.toString());
  assertEquals(event.reportTitle, report.title);
  assertEquals(event.username, report.user.username);
});
