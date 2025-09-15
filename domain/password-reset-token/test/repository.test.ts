import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import Timestamp, { TimeUnit } from "../../value-objects/timestamp.ts";
import Uuid from "../../value-objects/uuid.ts";
import { AlreadyExists, DoesNotExist } from "../error.ts";
import PasswordResetToken from "../passwordResetToken.ts";
import { randomPasswordResetToken } from "./passwordResetToken.ts";
import PasswordResetTokenTestRepository from "./repository.ts";

Deno.test("PasswordResetTokenTestRepository.create persists user correctly", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();

  const actual = await repository.create(passwordResetToken);

  assertEquals(actual.id, passwordResetToken.id);
  assertEquals(actual.userId, passwordResetToken.userId);
  assertEquals(actual.expiresAt, passwordResetToken.expiresAt);
});

Deno.test("PasswordResetTokenTestRepository.create throws error on conflict", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();

  await repository.create(passwordResetToken);

  await assertRejects(
    () => repository.create(passwordResetToken),
    AlreadyExists,
    `Password reset token with id '${passwordResetToken.id.toString()}' already exists`,
  );
});

Deno.test("PasswordResetTokenTestRepository.getById retrieves token by id", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();
  await repository.create(passwordResetToken);
  const actual = await repository.getById(passwordResetToken.id);

  assertEquals(actual.id, passwordResetToken.id);
  assertEquals(actual.userId, passwordResetToken.userId);
  assertEquals(actual.expiresAt, passwordResetToken.expiresAt);
});

Deno.test("PasswordResetTokenTestRepository.getById returns error when retrieving non-existent token by id", async () => {
  const repository = new PasswordResetTokenTestRepository();
  const nonExistentId = new Uuid("00000000-0000-0000-0000-000000000000");

  await assertRejects(
    () => repository.getById(nonExistentId),
    DoesNotExist,
    `Password reset token with id '${nonExistentId.toString()}' does not exist`,
  );
});

Deno.test("PasswordResetTokenTestRepository.getByUserId retrieves token by user id", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();
  await repository.create(passwordResetToken);
  const actual = await repository.getByUserId(passwordResetToken.userId);

  assertEquals(actual.id, passwordResetToken.id);
  assertEquals(actual.userId, passwordResetToken.userId);
  assertEquals(actual.expiresAt, passwordResetToken.expiresAt);
});

Deno.test("PasswordResetTokenTestRepository.getByUserId returns error when retrieving non-existent token by user id", async () => {
  const repository = new PasswordResetTokenTestRepository();
  const nonExistentId = new Uuid("00000000-0000-0000-0000-000000000000");

  await assertRejects(
    () => repository.getByUserId(nonExistentId),
    DoesNotExist,
    `Password reset token with id '${nonExistentId.toString()}' does not exist`,
  );
});

Deno.test("PasswordResetTokenTestRepository.delete deletes token correctly", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();
  await repository.create(passwordResetToken);

  await repository.delete(passwordResetToken);

  await assertRejects(
    () => repository.getById(passwordResetToken.id),
    DoesNotExist,
    `Password reset token with id '${passwordResetToken.id.toString()}' does not exist`,
  );
});

Deno.test("PasswordResetTokenTestRepository.update updates token correctly", async () => {
  const passwordResetToken = randomPasswordResetToken();
  const repository = new PasswordResetTokenTestRepository();
  await repository.create(passwordResetToken);

  const updatedToken = new PasswordResetToken(
    passwordResetToken.id,
    passwordResetToken.userId,
    passwordResetToken.createdAt,
    Timestamp.in(1, TimeUnit.HOURS), // Extend expiration time
  );

  const actual = await repository.update(updatedToken);

  assertEquals(actual.id, updatedToken.id);
  assertEquals(actual.userId, updatedToken.userId);
  assertEquals(actual.expiresAt, updatedToken.expiresAt);
});
