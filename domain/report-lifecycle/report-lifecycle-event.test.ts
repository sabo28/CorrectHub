import { ReportLifecycleEventType } from "@domain/report-lifecycle/report-lifecycle-event.ts";
import ReportLifecycleEvent from "@domain/report-lifecycle/report-lifecycle-event.ts";
import Uuid from "../value-objects/uuid.ts";
import randomReport from "../report/test/report.ts";
import { StatusName } from "../report/status.ts";
import Timestamp from "../value-objects/timestamp.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

Deno.test("ReportLifecycleEvent.toPrimitive returns primitive values", () => {
  const report = randomReport();
  const id = Uuid.newRandom();
  const event = new ReportLifecycleEvent(
    id,
    ReportLifecycleEventType.Creation,
    report,
    report.user,
    { status: StatusName.NEW },
    { status: StatusName.IN_PROGRESS },
    Timestamp.now(),
  );

  assertEquals(
    event.toPrimitive(),
    {
      id: id.toString(),
      type: ReportLifecycleEventType.Creation,
      reportId: report.id.toString(),
      actorId: report.user.id.toString(),
      actorName: report.user.username,
      isAnonymous: false,
      oldValues: { status: StatusName.NEW },
      newValues: { status: StatusName.IN_PROGRESS },
      createdAtMillis: event.createdAt.toUnixMillis(),
    },
  );
});

Deno.test("ReportLifecycleEvent.toPrimitive from anonymous returns primitive values", () => {
  const report = randomReport();
  report.isAnonym = true;

  const id = Uuid.newRandom();
  const event = new ReportLifecycleEvent(
    id,
    ReportLifecycleEventType.Creation,
    report,
    report.user,
    { status: StatusName.NEW },
    { status: StatusName.IN_PROGRESS },
    Timestamp.now(),
  );

  assertEquals(
    event.toPrimitive(),
    {
      id: id.toString(),
      type: ReportLifecycleEventType.Creation,
      reportId: report.id.toString(),
      actorId: report.user.id.toString(),
      actorName: "Anonym",
      isAnonymous: true,
      oldValues: { status: StatusName.NEW },
      newValues: { status: StatusName.IN_PROGRESS },
      createdAtMillis: event.createdAt.toUnixMillis(),
    },
  );
});
