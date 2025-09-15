import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import SessionTestRepository from "./repository.ts";
import { DoesNotExist, SessionAlreadyExists } from "../error.ts";
import { randomSession } from "./session.ts";
import Timestamp, { TimeUnit } from "../../value-objects/timestamp.ts";
import Session from "../session.ts";

Deno.test("SessionTestRepository.save speichert Session korrekt", async () => {
  const session = randomSession();
  const repository = new SessionTestRepository();

  const actual = await repository.save(session);

  assertEquals(actual.id, session.id);
  assertEquals(actual.userId, session.userId);
  assertEquals(actual.expiresAt.toUnix(), session.expiresAt.toUnix());
});

Deno.test("SessionTestRepository.save wirft Fehler bei bereits existierender ID", async () => {
  const session = randomSession();
  const repository = new SessionTestRepository();

  await repository.save(session);

  await assertRejects(
    () => repository.save(session),
    SessionAlreadyExists,
    `Session with id '${session.id.toString()}' already exists`,
  );
});

Deno.test("SessionTestRepository.getByUserId liefert Session korrekt", async () => {
  const session = randomSession();
  const repository = new SessionTestRepository();

  await repository.save(session);
  const actual = await repository.getByUserId(session.userId);

  assertEquals(actual.id, session.id);
  assertEquals(actual.userId, session.userId);
});

Deno.test("SessionTestRepository.getById liefert Session korrekt", async () => {
  const session = randomSession();
  const repository = new SessionTestRepository();

  await repository.save(session);
  const actual = await repository.getById(session.id);

  assertEquals(actual.id, session.id);
  assertEquals(actual.userId, session.userId);
});

Deno.test("SessionTestRepository.getById wirft Fehler bei unbekannter ID", async () => {
  const repository = new SessionTestRepository();
  const unknownId = randomSession().id;

  await assertRejects(
    () => repository.getById(unknownId),
    DoesNotExist,
    `Session with id '${unknownId.toString()}' does not exist`,
  );
});

Deno.test("SessionTestRepository.delete löscht Session korrekt", async () => {
  const repository = new SessionTestRepository();
  const session = randomSession();

  await repository.save(session);

  const storedSession = await repository.getById(session.id);
  assertEquals(JSON.stringify(storedSession), JSON.stringify(session));

  const deletedSession = await repository.delete(session);
  assertEquals(JSON.stringify(deletedSession), JSON.stringify(session));

  await assertRejects(
    () => repository.getById(session.id),
    DoesNotExist,
    `Session with id '${session.id.toString()}' does not exist`,
  );
});

Deno.test("SessionTestRepository.update aktualisiert Session korrekt", async () => {
  const repository = new SessionTestRepository();
  const session = randomSession();

  await repository.save(session);

  const newSession = new Session(
    session.id,
    session.userId,
    session.createdAt,
    Timestamp.in(30, TimeUnit.MINUTES),
    Timestamp.now(),
  );

  const actual = await repository.update(newSession);

  assertEquals(actual.id, session.id);
  assertEquals(actual.userId, session.userId);
  assertEquals(actual.expiresAt.toUnix(), newSession.expiresAt.toUnix());
  const storedSession = await repository.getById(session.id);
  assertEquals(JSON.stringify(storedSession), JSON.stringify(actual));
});
