import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { AlreadyExists, DoesNotExist, UserDoesNotExist } from "../error.ts";

import { randomUser } from "./user.ts";
import UserTestRepository from "./repository.ts";

Deno.test("UserTestRepository.save persists user correctly", async () => {
  const user = randomUser();
  const repository = new UserTestRepository();

  const actual = await repository.save(user);

  assertEquals(actual.id, user.id);
  assertEquals(actual.username, user.username);
  assertEquals(actual.email, user.email);
});

Deno.test("UserTestRepository.save throws error on conflict", async () => {
  const user = randomUser();
  const repository = new UserTestRepository();

  await repository.save(user);

  await assertRejects(
    () => repository.save(user),
    AlreadyExists,
    `User with id '${user.id.toString()}' already exists`,
  );
});

Deno.test("UserTestRepository.getByUsername retrieves user by name", async () => {
  const user = randomUser();
  const repository = new UserTestRepository();
  await repository.save(user);
  const actual = await repository.getByUsername(user.username);

  assertEquals(actual.id, user.id);
  assertEquals(actual.username, user.username);
  assertEquals(actual.email, user.email);
});

Deno.test("UserTestRepository.getByUsername returns error when retrieving non-existent user by name", async () => {
  const repository = new UserTestRepository();

  await assertRejects(
    () => repository.getByUsername("user_does_not_exist"),
    UserDoesNotExist,
    `User with username 'user_does_not_exist' does not exist`,
  );
});

Deno.test.ignore("UserTestRepository.delete deletes user correctly", () => {
  //
});

Deno.test("UserTestRepository.getById retrieves user by id", async () => {
  const repository = new UserTestRepository();
  const expected = randomUser();

  await repository.save(expected);

  const actual = await repository.getById(expected.id);
  assertEquals(actual, expected);
});

Deno.test(
  "UserTestRepository.getById returns error when retrieving non-existent user by id",
  async () => {
    const repository = new UserTestRepository();
    const user = randomUser();

    await assertRejects(
      () => repository.getById(user.id),
      DoesNotExist,
      `User with id '${user.id.toString()}' does not exist`,
    );
  },
);
