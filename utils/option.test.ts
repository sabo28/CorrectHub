import { assertEquals } from "$std/assert/assert_equals.ts";
import { assert } from "$std/assert/assert.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import { None, Some } from "./option.ts";

Deno.test("Option::isSome", () => {
  assert(Some("test").isSome());
  assert(!None().isSome());
});

Deno.test("Option::isNone", () => {
  assert(!Some("foo").isNone());
  assert(None().isNone());
});

Deno.test("Option::unwrap", () => {
  assertThrows(
    () => None().unwrap(),
    Error,
    "Option::unwrap() on a None value",
  );
  assertEquals(Some("test").unwrap(), "test");
});

Deno.test("Option::unwrapOr", () => {
  const none = None<string>();
  assertEquals(none.unwrapOr("foo"), "foo");

  const some = Some("value");
  assertEquals(some.unwrapOr("foo"), "value");
});

Deno.test("Option::unwrapOrElse", () => {
  const none = None<string>();
  assertEquals(none.unwrapOrElse(() => "foo"), "foo");

  const some = Some("value");
  assertEquals(some.unwrapOrElse(() => "foo"), "value");
});
