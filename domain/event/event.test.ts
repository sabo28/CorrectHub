import { assert } from "$std/assert/assert.ts";
import { assertFalse } from "$std/assert/assert_false.ts";
import Event from "./event.ts";

class TestEvent extends Event {}

Deno.test("Event.is checks if object is an event", () => {
  const event = new TestEvent();
  assert(event.is(event));
  assertFalse(event.is(null));
});
