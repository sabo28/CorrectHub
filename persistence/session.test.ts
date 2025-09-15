import { randomSession } from "@domain/session/test/session.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import UserRepository from "./user.ts";
import SessionRepository from "./session.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import {
  DoesNotExist,
  SessionWithUserIdDoesNotExist,
} from "@domain/session/error.ts";
import { randomUser } from "@domain/user/test/user.ts";

Deno.test("SessionRepository", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);
  const sessionRepository = new SessionRepository(db);

  const user = randomUser();
  await userRepository.save(user);

  const expected = randomSession(user.id);

  await t.step("Save session", async () => {
    const result = await sessionRepository.save(expected);
    assertEquals(result.id, expected.id);
  });

  await t.step("Load session", async () => {
    const actual = await sessionRepository.getById(expected.id);
    assertEquals(actual, expected);
  });

  await t.step("Load non-existent session", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => sessionRepository.getById(id),
      DoesNotExist,
      `Session with id '${id.toString()}' does not exist`,
    );
  });

  await t.step("Load session by user ID", async () => {
    const actual = await sessionRepository.getByUserId(user.id);
    assertEquals(actual, expected);
  });

  await t.step("Load session by non-existent user ID", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => sessionRepository.getByUserId(id),
      SessionWithUserIdDoesNotExist,
      `Session with user id '${id.toString()}' does not exist`,
    );
  });

  //   await t.step("Update session", async () => {
  //     const session = await sessionRepository.getById(expected.id);
  //     session.expiresAt = Timestamp.in(-1000);

  //     const updatedSession = await sessionRepository.update(session);
  //   });

  //   await t.step("Update non-existent session", async () => {
  //   });

  await container.stop();
});
