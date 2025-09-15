import { assertEquals } from "$std/assert/mod.ts";
import { randomUser } from "../user/test/user.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";
import Comment from "./comment.ts";

Deno.test("Comment.toPrimitive converts to primitive", () => {
  const id = Uuid.newRandom();
  const reportId = Uuid.newRandom();
  const user = randomUser();
  const now = Timestamp.now();

  const comment = new Comment(
    id,
    reportId,
    user,
    false,
    "Test",
    now,
  );

  assertEquals(comment.toPrimitive(), {
    id: id.toString(),
    reportId: reportId.toString(),
    username: user.username,
    text: "Test",
    createdAtMillis: now.toUnixMillis(),
  });
});

Deno.test("Comment.toPrimitive converts to primitive with anonymous name", () => {
  const id = Uuid.newRandom();
  const reportId = Uuid.newRandom();
  const user = randomUser();
  const now = Timestamp.now();

  const comment = new Comment(
    id,
    reportId,
    user,
    true,
    "Test",
    now,
  );

  assertEquals(comment.toPrimitive(), {
    id: id.toString(),
    reportId: reportId.toString(),
    username: "Anonym",
    text: "Test",
    createdAtMillis: now.toUnixMillis(),
  });
});
