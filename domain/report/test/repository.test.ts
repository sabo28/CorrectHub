import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { randomUser } from "@domain/user/test/user.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import {
  ReportDoesNotExist,
  ReportWithUserIdDoesNotExist,
} from "@domain/report/error.ts";
import UserTestRepository from "@domain/user/test/repository.ts";
import ReportTestRepository from "./repository.ts";
import randomReport from "./report.ts";

Deno.test("ReportRepository", async (t) => {
  const userRepository = new UserTestRepository();
  const reportRepository = new ReportTestRepository();

  const expected = randomReport({ title: "Test report" });
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
    const report = await reportRepository.getById(expected.id);
    assertEquals(report.title, "Test report");

    report.title = "Updated report";
    const updatedReport = await reportRepository.update(report);

    assertEquals(updatedReport.title, "Updated report");

    const loadedReport = await reportRepository.getById(expected.id);
    assertEquals(loadedReport.title, "Updated report");
  });

  await t.step("Update non-existent report", async () => {
    const report = randomReport();

    await assertRejects(
      () => reportRepository.update(report),
      ReportDoesNotExist,
      `Report with id '${report.id.toString()}' does not exist`,
    );
  });
});
