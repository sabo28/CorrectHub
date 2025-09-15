import { assert } from "$std/assert/assert.ts";
import { assertFalse } from "$std/assert/assert_false.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";
import Session from "./session.ts";

Deno.test("Session.isActive returns true when session is not yet expired", () => {
  const session = new Session(
    Uuid.newRandom(),
    Uuid.newRandom(),
    Timestamp.now(),
    Timestamp.in(5000),
    Timestamp.now(),
  );

  assert(session.isActive);
});

Deno.test("Session.isActive returns false when session has expired", () => {
  const session = new Session(
    Uuid.newRandom(),
    Uuid.newRandom(),
    Timestamp.now(),
    Timestamp.now(), // expiration falls on the same second as it is right now
    Timestamp.now(),
  );

  assertFalse(session.isActive);
});
