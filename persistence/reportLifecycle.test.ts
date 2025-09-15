import ReportLifecycleEvent, {
  ReportLifecycleEventType,
} from "@domain/report-lifecycle/report-lifecycle-event.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import UserRepository from "./user.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import ReportLifecycleRepository from "./reportLifecycle.ts";
import ReportRepository from "./report.ts";
import randomReport from "@domain/report/test/report.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";

Deno.test("ReportLifeCycle", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);
  const reportRepository = new ReportRepository(db, userRepository);
  const reportLifecycleRepository = new ReportLifecycleRepository(
    db,
    reportRepository,
    userRepository,
  );

  const report = randomReport();

  await userRepository.save(report.user);
  await reportRepository.create(report);

  const eventId = Uuid.newRandom();
  const event = new ReportLifecycleEvent(
    eventId,
    ReportLifecycleEventType.Creation,
    report,
    report.user,
    {},
    report.toPrimitive(),
    Timestamp.now(),
  );

  await t.step("Save lifecycle event", async () => {
    const result = await reportLifecycleRepository.save(event);
    assertEquals(result.id, eventId);
    assertEquals(
      result.toPrimitive(),
      event.toPrimitive(),
    );
  });

  await t.step("List lifecycle events", async () => {
    const list = await reportLifecycleRepository.list(report.id);
    assertEquals(list.length, 1);
    assertEquals(
      list[0].toPrimitive(),
      event.toPrimitive(),
    );
  });

  await t.step("List empty lifecycle events", async () => {
    const id = Uuid.newRandom();
    const list = await reportLifecycleRepository.list(id);
    assertEquals(list.length, 0);
  });

  await container.stop();
});
