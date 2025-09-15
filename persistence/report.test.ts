import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import { randomUser } from "@domain/user/test/user.ts";
import UserRepository from "./user.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import ReportRepository from "./report.ts";
import {
  ReportDoesNotExist,
  ReportWithUserIdDoesNotExist,
} from "@domain/report/error.ts";
import randomReport from "@domain/report/test/report.ts";

Deno.test("ReportRepository", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);
  const reportRepository = new ReportRepository(db, userRepository);

  const expected = randomReport();
  await userRepository.save(expected.user);
  const user = expected.user;

  await t.step("Save report", async () => {
    const result = await reportRepository.create(expected);
    assertEquals(result.id, expected.id);
  });

  await t.step("Load report", async () => {
    const actual = await reportRepository.getById(expected.id);
    assertEquals(actual, expected);
  });

  await t.step("Load non-existent report", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => reportRepository.getById(id),
      ReportDoesNotExist,
      `Report with id '${id.toString()}' does not exist`,
    );
  });

  await t.step("Load report by user", async () => {
    const actual = await reportRepository.getByUser(user);
    assertEquals(actual, expected);
  });

  await t.step("Load report by non-existent user", async () => {
    const nonExistentUser = randomUser();
    await assertRejects(
      () => reportRepository.getByUser(nonExistentUser),
      ReportWithUserIdDoesNotExist,
      `Report with user id '${nonExistentUser.id.toString()}' does not exist`,
    );
  });

  await t.step("Update report", async () => {
    expected.assignee = user;

    const current = await reportRepository.getById(expected.id);
    assertEquals(current.assignee, undefined);

    const actual = await reportRepository.update(expected);
    assertEquals(actual, expected);
    assertEquals(actual.assignee, user);
  });

  await t.step("List reports", async () => {
    const list = await reportRepository.list();

    assertEquals(list.length, 1);
    assertEquals(list[0], expected);
  });

  await t.step("List reports by user ID", async () => {
    const list = await reportRepository.list({
      userId: user.id,
    });

    assertEquals(list.length, 1);
    assertEquals(list[0], expected);
  });

  await t.step("List reports filtered by title", async () => {
    const list = await reportRepository.list({
      title: "HELLO_WORLD",
    });

    assertEquals(list.length, 0);
  });

  await container.stop();
});
