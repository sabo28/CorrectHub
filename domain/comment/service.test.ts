import { NoPermissionToCreateComment } from "@domain/comment/error.ts";
import ReportTestRepository from "../report/test/repository.ts";
import UserTestRepository from "../user/test/repository.ts";
import { randomUser } from "../user/test/user.ts";
import { CommentService } from "./service.ts";
import { EventService } from "../event/service.ts";
import { ReportService } from "../report/service.ts";
import { randomSession } from "../session/test/session.ts";
import SessionTestRepository from "../session/test/repository.ts";
import CommentTestRepository from "./test/repository.ts";
import ReportCategory from "../report/category.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import randomReport from "../report/test/report.ts";
import { assertRejects } from "$std/assert/mod.ts";
import Comment from "./comment.ts";
import Uuid from "../value-objects/uuid.ts";
import Timestamp, { TimeUnit } from "../value-objects/timestamp.ts";

Deno.test("CommentService.create creates new comment with userName", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();
  const commentRepository = new CommentTestRepository();

  const reportService = new ReportService(
    reportRepository,
    eventService,
  );

  const commentService = new CommentService(
    commentRepository,
    eventService,
  );

  const report = await reportService.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  const comment = await commentService.create(
    user,
    report,
    "Es gibt ein Problem bei dem Skript XYZ",
    false,
  );

  assertEquals(comment.displayUserName, user.username);
  assertEquals(comment.text, "Es gibt ein Problem bei dem Skript XYZ");
  assertEquals(comment.user.id, user.id);
  assertEquals(comment.reportId, report.id);
});

Deno.test("CommentService.create creates new comment without userName", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();
  const commentRepository = new CommentTestRepository();

  const reportService = new ReportService(
    reportRepository,
    eventService,
  );

  const commentService = new CommentService(
    commentRepository,
    eventService,
  );

  const report = await reportService.create(
    user,
    "Test Report",
    "This is a test report.",
    ReportCategory.ContentError,
    false,
  );

  const comment = await commentService.create(
    user,
    report,
    "Es gibt ein Problem bei dem Skript XYZ",
    true,
  );

  assertEquals(comment.displayUserName, "Anonym");
  assertEquals(comment.text, "Es gibt ein Problem bei dem Skript XYZ");
  assertEquals(comment.user.id, user.id);
  assertEquals(comment.reportId, report.id);
});

Deno.test("CommentService.create fails when user has no permission to comment", async () => {
  const commentRepository = new CommentTestRepository();
  const eventService = new EventService();
  const commentService = new CommentService(commentRepository, eventService);

  const fakeUser = randomUser();
  fakeUser.permissions.canCreateComment = () => false;

  const report = randomReport();

  await assertRejects(
    () =>
      commentService.create(
        fakeUser,
        report,
        "I should not be able to comment!",
        true,
      ),
    NoPermissionToCreateComment,
    "You are not allowed to comment on this post",
  );
});

Deno.test("CommentService.getByReportId retrieves all comments for report", async () => {
  const user = randomUser();
  const userRepository = new UserTestRepository();
  await userRepository.save(user);
  const session = randomSession(user.id);
  const sessionRepository = new SessionTestRepository();
  await sessionRepository.save(session);

  const reportRepository = new ReportTestRepository();
  const eventService = new EventService();
  const commentRepository = new CommentTestRepository();
  const commentService = new CommentService(commentRepository, eventService);

  const report = randomReport();

  await reportRepository.create(report);

  const comment1 = new Comment(
    Uuid.newRandom(),
    report.id,
    user,
    true,
    "Comment 1",
    Timestamp.in(0, TimeUnit.SECONDS),
  );

  const comment2 = new Comment(
    Uuid.newRandom(),
    report.id,
    user,
    false,
    "Comment 2",
    Timestamp.in(1, TimeUnit.HOURS),
  );

  await commentRepository.create(comment1);
  await commentRepository.create(comment2);

  const comments = await commentService.getByReportId(report.id);
  assertEquals(comments.length, 2);
  assertEquals(comments[0].toPrimitive(), comment1.toPrimitive());
  assertEquals(comments[1].toPrimitive(), comment2.toPrimitive());
});
