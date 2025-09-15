import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import Uuid from "./uuid.ts";

Deno.test("Uuid throws when invalid format", () => {
  assertThrows(() => new Uuid("foo"), Error, "invalid uuid: 'foo'");
});

Deno.test("Uuid correctly created", () => {
  const expected = "00000000-0000-0000-0000-000000000000";
  const uuid = new Uuid(expected);
  assertEquals(uuid.toString(), expected);
});

Deno.test("Uuid.newRandom creates Uuid", () => {
  const uuid = Uuid.newRandom();
  const check = new Uuid(uuid.toString());

  assertEquals(uuid.toString(), check.toString());
});
