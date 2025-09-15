import { randomUser } from "@domain/user/test/user.ts";
import { assertEquals } from "$std/assert/mod.ts";
import ReportCreation from "../report/events/report-creation.ts";
import ReportUpdate from "../report/events/report-update.ts";
import randomReport from "../report/test/report.ts";
import ReportLifecycleListener from "./listener.ts";
import ReportLifecycleService from "./service.ts";
import ReportLifecycleTestRepository from "./test/repository.ts";
import Status, { StatusName } from "../report/status.ts";
import ReportStatusChange from "../report/events/report-status-change.ts";
import Link from "../report/link.ts";

Deno.test("ReportLifecycleListener.notify reacts upon ReportCreation", async () => {
  const repository = new ReportLifecycleTestRepository();
  const service = new ReportLifecycleService(repository);
  const listener = new ReportLifecycleListener(service);

  const report = randomReport();
  const event = new ReportCreation(report);

  await listener.notify(event);

  const result = await repository.list(report.id);

  assertEquals(result.length, 1);
  assertEquals(JSON.stringify(result[0].actor), JSON.stringify(report.user));
  assertEquals(result[0].type, "CREATION");
  assertEquals(result[0].oldValues, {});
  assertEquals(result[0].newValues, report.toPrimitive());
});

Deno.test("ReportLifecycleListener.notify reacts upon ReportUpdate", async () => {
  const repository = new ReportLifecycleTestRepository();
  const service = new ReportLifecycleService(repository);
  const listener = new ReportLifecycleListener(service);

  const actor = randomUser();

  const oldReport = randomReport();
  const newReport = oldReport.clone();

  newReport.title = "Hello world";
  newReport.description = "Something else";
  newReport.links = Link.fromArray(["https://lumio.at"]);

  // Although changing the status results in an additional event
  newReport.status = new Status(StatusName.RESOLVED);

  const event = new ReportUpdate(actor, oldReport, newReport);
  await listener.notify(event);

  const result = await repository.list(oldReport.id);

  assertEquals(result.length, 1);
  assertEquals(JSON.stringify(result[0].actor), JSON.stringify(actor));
  assertEquals(result[0].type, "UPDATE");
  assertEquals(result[0].oldValues, {
    title: oldReport.title,
    description: oldReport.description,
    status: StatusName.NEW,
    links: ["https://example.com/"],
  });
  assertEquals(result[0].newValues, {
    title: newReport.title,
    description: newReport.description,
    status: StatusName.RESOLVED,
    links: ["https://lumio.at/"],
  });
});

Deno.test("ReportLifecycleListener.notify reacts upon ReportStatusChange", async () => {
  const repository = new ReportLifecycleTestRepository();
  const service = new ReportLifecycleService(repository);
  const listener = new ReportLifecycleListener(service);

  const actor = randomUser();

  const report = randomReport();
  report.status = new Status(StatusName.IN_PROGRESS);

  const event = new ReportStatusChange(
    actor,
    report,
    new Status(StatusName.NEW),
  );
  await listener.notify(event);

  const result = await repository.list(report.id);

  assertEquals(result.length, 1);
  assertEquals(result[0].type, "STATUS_CHANGE");
  assertEquals(JSON.stringify(result[0].actor), JSON.stringify(actor));
  assertEquals(result[0].oldValues, {
    status: StatusName.NEW,
  });
  assertEquals(result[0].newValues, {
    status: StatusName.IN_PROGRESS,
  });
});
