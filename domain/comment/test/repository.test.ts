import { assertEquals } from "$std/assert/assert_equals.ts";
import randomReport from "../../report/test/report.ts";
import ReportTestRepository from "../../report/test/repository.ts";
import UserTestRepository from "../../user/test/repository.ts";
import { randomUser } from "../../user/test/user.ts";
import Timestamp from "../../value-objects/timestamp.ts";
import Uuid from "../../value-objects/uuid.ts";
import Comment from "../comment.ts";
import CommentTestRepository from "./repository.ts";

Deno.test("CommentRepository", async (t) => {
  const reportRepository = new ReportTestRepository();
  const userRepository = new UserTestRepository();
  const user = randomUser();
  await userRepository.save(user);

  const commentRepository = new CommentTestRepository();

  const reportBody = randomReport();

  const report = await reportRepository.create(reportBody);

  const commentBody = new Comment(
    Uuid.newRandom(),
    report.id,
    user,
    false,
    "XYZ",
    Timestamp.now(),
  );

  const comment = await commentRepository.create(commentBody);

  await t.step("Save comment", async () => {
    const result = await commentRepository.create(comment);
    assertEquals(result.id, comment.id);
  });

  await t.step("Load comment", async () => {
    const actual = await commentRepository.getById(comment.id);
    assertEquals(actual, comment);
  });

  await t.step("Load all comments", async () => {
    const actual = await commentRepository.getAllByReportId(comment.reportId);
    assertEquals(actual, [comment]);
  });
});
