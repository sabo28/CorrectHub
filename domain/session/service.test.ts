import { assertRejects } from "$std/assert/assert_rejects.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { SessionService } from "./service.ts";
import UserTestRepository from "../user/test/repository.ts";
import SessionTestRepository from "./test/repository.ts";
import { randomUser } from "../user/test/user.ts";
import {
  InvalidCredentialsWithEmail,
  InvalidCredentialsWithUsername,
} from "./error.ts";
import { randomSession } from "./test/session.ts";
import { DoesNotExist, EmailNotVerified } from "./error.ts";
import Uuid from "../value-objects/uuid.ts";

Deno.test("SessionService.loginByEmail throws if email does not exist", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  await userRepo.save(user);

  await assertRejects(
    () => service.loginByEmail("nicht@vorhanden.de", "geheim"),
    InvalidCredentialsWithEmail,
    "User 'nicht@vorhanden.de' does not exist or password does not match",
  );
});

Deno.test("SessionService.loginByEmail throws if password is wrong", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  await userRepo.save(user);

  await assertRejects(
    () => service.loginByEmail("example@example.com", "falsches_passwort"),
    InvalidCredentialsWithEmail,
    "User 'example@example.com' does not exist or password does not match",
  );
});

Deno.test("SessionService.login throws if email is not verified", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser({ password: "123" });
  user.emailVerified = false;

  await userRepo.save(user);

  await assertRejects(
    () => service.login("example@example.com", "123"),
    EmailNotVerified,
    "Email address 'example@example.com' not verified yet",
  );
});

Deno.test("SessionService.login creates and returns new session", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  user.emailVerified = true;

  await userRepo.save(user);

  const result = await service.loginByEmail("example@example.com", "123456");

  assertEquals(result.userId.toString(), user.id.toString());
});

Deno.test("SessionService.loginByUsername throws if username does not exist", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  await userRepo.save(user);

  await assertRejects(
    () => service.loginByUsername("nichtVorhanden", "geheim"),
    InvalidCredentialsWithUsername,
    "User 'nichtVorhanden' does not exist or password does not match",
  );
});

Deno.test("SessionService.loginByUsername throws if username is right but is written wrong", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  await userRepo.save(user);

  await assertRejects(
    () => service.loginByUsername("maX musterMan", "geheim"),
    InvalidCredentialsWithUsername,
    "User 'maX musterMan' does not exist or password does not match",
  );
});

Deno.test("SessionService.loginByUsername throws if password is wrong", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  await userRepo.save(user);

  await assertRejects(
    () => service.loginByUsername("Max Musterman", "falsches_passwort"),
    InvalidCredentialsWithUsername,
    "User 'Max Musterman' does not exist or password does not match",
  );
});

Deno.test("SessionService.loginByUsername creates and returns new session", async () => {
  const userRepo = new UserTestRepository();
  const sessionRepo = new SessionTestRepository();
  const service = new SessionService(userRepo, sessionRepo);

  const user = randomUser();
  user.emailVerified = true;

  await userRepo.save(user);

  const result = await service.loginByUsername("Max Musterman", "123456");

  assertEquals(result.userId.toString(), user.id.toString());
});

Deno.test("SessionService.logout fails when session is invalid", async () => {
  const sessionRepository = new SessionTestRepository();
  const userRepository = new UserTestRepository();

  const service = new SessionService(userRepository, sessionRepository);

  const id = Uuid.newRandom();
  await assertRejects(
    () => service.logout(id),
    DoesNotExist,
    `Session with id '${id.toString()}' does not exist`,
  );
});

Deno.test("SessionService.logout correctly deletes session from repository", async () => {
  const sessionRepository = new SessionTestRepository();
  const userRepository = new UserTestRepository();

  const service = new SessionService(userRepository, sessionRepository);
  const session = randomSession();

  await sessionRepository.save(session);

  const storedSession = await sessionRepository.getById(session.id);
  assertEquals(storedSession.id.toString(), session.id.toString());
  assertEquals(storedSession.userId.toString(), session.userId.toString());

  const result = await service.logout(session.id);

  assertEquals(result.id.toString(), session.id.toString());
  assertEquals(result.userId.toString(), session.userId.toString());

  await assertRejects(
    () => sessionRepository.getById(session.id),
    DoesNotExist,
    `Session with id '${session.id.toString()}' does not exist`,
  );
});

Deno.test("SessionService.extendSession extends session expiration", async () => {
  const sessionRepository = new SessionTestRepository();
  const userRepository = new UserTestRepository();

  const service = new SessionService(userRepository, sessionRepository);
  const session = randomSession();

  await sessionRepository.save(session);

  const result = await service.extendSession(session);

  const extendedSession = await sessionRepository.getById(session.id);

  assertEquals(extendedSession.id.toString(), result.id.toString());
  assertEquals(extendedSession.userId.toString(), result.userId.toString());
  assertEquals(extendedSession.expiresAt.toUnix(), result.expiresAt.toUnix());
  assertEquals(extendedSession.expiresAt.toUnix(), result.expiresAt.toUnix());
});
