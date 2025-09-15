import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import UserRepository from "./user.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import ReportRepository from "./report.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import randomReport from "@domain/report/test/report.ts";
import CommentRepository from "./comment.ts";
import Comment from "@domain/comment/comment.ts";
import { CommentDoesNotExist } from "@domain/comment/error.ts";

Deno.test("ReportRepository", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);
  const reportRepository = new ReportRepository(db, userRepository);
  const commentRepository = new CommentRepository(db, userRepository);

  const report = randomReport();
  await userRepository.save(report.user);
  await reportRepository.create(report);
  const user = report.user;

  const expected = new Comment(
    Uuid.newRandom(),
    report.id,
    user,
    false,
    "Hello world",
    Timestamp.now(),
  );

  await t.step("Save comment", async () => {
    const result = await commentRepository.create(expected);
    assertEquals(result.id, expected.id);
  });

  await t.step("Load comment", async () => {
    const actual = await commentRepository.getById(expected.id);
    assertEquals(actual, expected);
  });

  await t.step("Load non-existent comment", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => commentRepository.getById(id),
      CommentDoesNotExist,
      `Comment with id '${id.toString()}' does not exist`,
    );
  });

  await t.step("Load comments by report ID", async () => {
    const actual = await commentRepository.getAllByReportId(report.id);
    assertEquals(actual.length, 1);
    assertEquals(actual[0], expected);
  });

  await container.stop();
});
