import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import UserRepository from "./user.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import ReportRepository from "./report.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import AttachmentRepository from "./attachment.ts";
import Attachment from "@domain/attachment/attachment.ts";
import { Buffer } from "node:buffer";
import { DoesNotExist } from "@domain/attachment/error.ts";
import randomReport from "@domain/report/test/report.ts";

Deno.test("ReportRepository", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);
  const reportRepository = new ReportRepository(db, userRepository);
  const attachmentRepository = new AttachmentRepository(db);

  const report = randomReport();
  await userRepository.save(report.user);
  await reportRepository.create(report);
  const user = report.user;

  const expected = new Attachment(
    Uuid.newRandom(),
    report.id,
    user.id,
    "text/html",
    Buffer.from("<html></html>"),
    Timestamp.now(),
    Timestamp.now(),
  );

  await t.step("Save attachment", async () => {
    const result = await attachmentRepository.save(expected);
    assertEquals(result.id, expected.id);
  });

  await t.step("Load attachment", async () => {
    const actual = await attachmentRepository.getById(expected.id);
    assertEquals(actual, expected);
  });

  await t.step("Load non-existent attachment", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => attachmentRepository.getById(id),
      DoesNotExist,
      `Attachment with id '${id.toString()}' does not exist`,
    );
  });

  //   await t.step("Load attachment by user ID", async () => {
  //     const actual = await attachmentRepository.getByCreatedBy(user.id);
  //     assertEquals(actual.length, 1);
  //     assertEquals(actual[0], expected);
  //   });

  //   await t.step("Load report by non-existent user", async () => {
  //     const id = Uuid.newRandom();
  //     const actual = await attachmentRepository.getByCreatedBy(id);
  //     assertEquals(actual.length, 0);
  //     assertEquals(actual, []);
  //   });

  await container.stop();
});
