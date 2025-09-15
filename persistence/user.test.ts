import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import getDb from "./test/db.ts";
import { randomUser } from "@domain/user/test/user.ts";
import UserRepository from "./user.ts";
import PostgresContainer from "./test/postgres.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import {
  DoesNotExist,
  EmailDoesNotExist,
  UserDoesNotExist,
} from "@domain/user/error.ts";
import Email from "@domain/value-objects/email.ts";

Deno.test("UserRepository", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  const db = await getDb(container.databaseUrl);
  const userRepository = new UserRepository(db);

  const expected = randomUser();

  await t.step("Save user", async () => {
    const result = await userRepository.save(expected);
    assertEquals(result.id, expected.id);
  });

  await t.step("Load user", async () => {
    const user = await userRepository.getById(expected.id);
    assertEquals(user, expected);
  });

  await t.step("Load non-existent user", async () => {
    const id = Uuid.newRandom();
    await assertRejects(
      () => userRepository.getById(id),
      DoesNotExist,
      `User with id '${id.toString()}' does not exist`,
    );
  });

  await t.step("Load user by E-Mail", async () => {
    const user = await userRepository.getByEmail(expected.email);
    assertEquals(user, expected);
  });

  await t.step("Load user by non-existent E-Mail", async () => {
    const email = new Email("12345@1234.com");
    await assertRejects(
      () => userRepository.getByEmail(email),
      EmailDoesNotExist,
      `User with email '${email.toString()}' does not exist`,
    );
  });

  await t.step("Load user by username", async () => {
    const user = await userRepository.getByUsername(expected.username);
    assertEquals(user, expected);
  });

  await t.step("Load user by non-existent username", async () => {
    const randomName = Uuid.newRandom().toString();
    await assertRejects(
      () => userRepository.getByUsername(randomName),
      UserDoesNotExist,
      `User with username '${randomName}' does not exist`,
    );
  });

  await t.step("Update user", async () => {
    const user = await userRepository.getById(expected.id);
    user.emailVerified = !user.emailVerified;

    const updatedUser = await userRepository.update(user);
    assertEquals(updatedUser.emailVerified, user.emailVerified);
    assertEquals(updatedUser.emailVerified, !expected.emailVerified);
  });

  await t.step("Update non-existent user", async () => {
    const user = randomUser();
    await assertRejects(
      () => userRepository.update(user),
      DoesNotExist,
      `User with id '${user.id}' does not exist`,
    );
  });

  await container.stop();
});
