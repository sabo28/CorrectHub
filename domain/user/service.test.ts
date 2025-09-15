import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assert } from "$std/assert/assert.ts";
import { UserService } from "./service.ts";
import UserTestRepository from "./test/repository.ts";
import { EmailAlreadyExists, InvalidVerificationCode } from "./error.ts";
import { EventService } from "../event/service.ts";
import Email from "../value-objects/email.ts";

Deno.test("UserService.register creates new user", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  const user = await service.register(
    "Marianne Musterfrau",
    "marianne@musterfrau.com",
    "hello_world",
  );

  assertEquals(user.username, "Marianne Musterfrau");
  assertEquals(user.email.toString(), "marianne@musterfrau.com");
  assert(user.password.verify("hello_world"), "password matches");
});

Deno.test("UserService.register fails when user with same E-Mail exists", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  await service.register(
    "Marianne Musterfrau",
    "marianne@musterfrau.com",
    "hello_world",
  );

  await assertRejects(
    () =>
      service.register(
        "Jemand anderes",
        "marianne@musterfrau.com",
        "anderes passwort",
      ),
    EmailAlreadyExists,
    "User with email 'marianne@musterfrau.com' does already exist",
  );
});

Deno.test("UserService.register fails on any error that is not EmailDoesNotExist", async () => {
  const repository = new UserTestRepository({
    getByEmail() {
      return Promise.reject(new Error("any error"));
    },
  });
  const service = new UserService(repository, new EventService());

  await assertRejects(
    () =>
      service.register(
        "Jemand anderes",
        "example@example.com",
        "anderes passwort",
      ),
    Error,
    "any error",
  );
});

Deno.test("UserService.verify successfully verifies user email address", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  const user = await service.register(
    "Marianne Musterfrau",
    "marianne@musterfrau.com",
    "hello_world",
  );

  await service.verify(user.verificationCode.toString());

  const latestUser = await repository.getByEmail(
    new Email("marianne@musterfrau.com"),
  );

  assert(latestUser.emailVerified);
});

Deno.test("UserService.verify fails on invalid code with no email encoded", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  await assertRejects(
    () =>
      service.verify(
        "-",
      ),
    InvalidVerificationCode,
    "Invalid verification code for given user",
  );
});

Deno.test("UserService.verify fails on invalid code", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  await service.register(
    "Marianne Musterfrau",
    "marianne@musterfrau.com",
    "hello_world",
  );

  await assertRejects(
    () =>
      service.verify(
        "6d617269616e6e65406d7573746572667261752e636f6d3b146a1aefbfbd0559",
      ),
    InvalidVerificationCode,
    "Invalid verification code for given user",
  );
});

Deno.test("UserService.verify fails on invalid code with no email encoded", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  await assertRejects(
    () =>
      service.verify(
        "-",
      ),
    InvalidVerificationCode,
    "Invalid verification code for given user",
  );
});

Deno.test("UserService.verify fails on invalid code", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());

  await service.register(
    "Marianne Musterfrau",
    "marianne@musterfrau.com",
    "hello_world",
  );

  await assertRejects(
    () =>
      service.verify(
        "6d617269616e6e65406d7573746572667261752e636f6d3b146a1aefbfbd0559",
      ),
    InvalidVerificationCode,
    "Invalid verification code for given user",
  );
});
