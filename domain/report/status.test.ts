import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assert } from "$std/assert/assert.ts";
import Status, { StatusName } from "./status.ts";
import { assertFalse } from "$std/assert/assert_false.ts";

Deno.test("Status comparison returns correct value", () => {
  assert(Status.New.is(Status.New));
  assertFalse(Status.New.is(Status.InProgress));

  assert(Status.InProgress.is(Status.InProgress));
  assertFalse(Status.InProgress.is(Status.Resolved));
});

Deno.test("Status correctly translate to string", () => {
  assertEquals(Status.New.toString(), "NEW");
  assertEquals(Status.InProgress.toString(), "IN_PROGRESS");
  assertEquals(Status.Resolved.toString(), "RESOLVED");
});

Deno.test("Status creation from string works", () => {
  const status = new Status("IN_PROGRESS" as StatusName);
  assert(status.is(Status.InProgress));
});

Deno.test("Status creation from string fails on invalid Status name", () => {
  assertThrows(
    () => new Status("foo" as unknown as StatusName),
    Error,
    "invalid Status name 'foo'",
  );
});
