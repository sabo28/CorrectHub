import { assertEquals } from "$std/assert/assert_equals.ts";
import { ReportService } from "./service.ts";
import UserTestRepository from "../user/test/repository.ts";
import { randomUser } from "../user/test/user.ts";
import SessionTestRepository from "../session/test/repository.ts";
import { randomSession } from "../session/test/session.ts";
import ReportTestRepository from "./test/repository.ts";
import ReportCategory, { CategoryName } from "./category.ts";
import { EventService } from "../event/service.ts";
import Uuid from "../value-objects/uuid.ts";
import Status from "./status.ts";
import { NoPermissionToUpdateStatus, ReportDoesNotExist } from "./error.ts";
import { assertRejects } from "$std/assert/mod.ts";
import Role from "../user/role.ts";
import randomReport from "./test/report.ts";

Deno.test("ReportService.create creates new report with userName", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();

  const service = new ReportService(
    reportRepository,
    eventService,
  );

  const report = await service.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  assertEquals(report.title, "Test Report");
  assertEquals(report.description, "This is a test report.");
  assertEquals(report.category, new ReportCategory(CategoryName.CONTENT_ERROR));
  assertEquals(report.user.id, user.id);
  assertEquals(report.displayUserName, user.username);
});

Deno.test("ReportService.create creates new report anonymous", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();

  const service = new ReportService(
    reportRepository,
    eventService,
  );

  const report = await service.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    true,
  );

  assertEquals(report.title, "Test Report");
  assertEquals(report.description, "This is a test report.");
  assertEquals(report.category, new ReportCategory(CategoryName.CONTENT_ERROR));
  assertEquals(report.user.id, user.id);
  assertEquals(report.isAnonym, true);
  assertEquals(report.displayUserName, "Anonymous");
});

Deno.test("ReportService.update updates existing report but fails on non-existing report", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();

  const service = new ReportService(
    reportRepository,
    eventService,
  );

  const report = await service.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  assertEquals(report.title, "Test Report");

  report.title = "Updated report";

  const updatedReport = await service.update(user, report);
  assertEquals(updatedReport.title, "Updated report");

  const nonExistentReport = randomReport();

  await assertRejects(
    () => service.update(user, nonExistentReport),
    ReportDoesNotExist,
    `Report with id '${nonExistentReport.id.toString()}' does not exist`,
  );
});

Deno.test("ReportService.updateStatus updates status of existing report and fails on non-existing report", async () => {
  const user = randomUser();
  user.role = Role.Admin;

  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();

  const service = new ReportService(
    reportRepository,
    eventService,
  );

  const report = await service.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  assertEquals(report.status.value, Status.New.value);

  const updatedReport = await service.updateStatus(
    report.id,
    user,
    Status.InProgress.value,
  );
  assertEquals(updatedReport.status.value, Status.InProgress.value);

  const id = Uuid.newRandom();

  await assertRejects(
    () => service.updateStatus(id, user, Status.InProgress.value),
    ReportDoesNotExist,
    `Report with id '${id.toString()}' does not exist`,
  );
});

Deno.test("ReportService.updateStatus fails on missing permissions", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();

  const service = new ReportService(
    reportRepository,
    eventService,
  );

  const report = await service.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  assertEquals(report.status.value, Status.New.value);

  await assertRejects(
    () => service.updateStatus(report.id, user, Status.InProgress.value),
    NoPermissionToUpdateStatus,
    `Status of report with id '${report.id.toString()}' cannot be changed due to lack of permissions`,
  );
});
