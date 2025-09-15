import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assert } from "$std/assert/assert.ts";
import Role, { RoleName } from "./role.ts";

Deno.test("Role comparison returns correct value", () => {
  assert(Role.Admin.is(Role.Admin));
  assert(!Role.Admin.is(Role.Member));

  assert(Role.Member.is(Role.Member));
  assert(!Role.Member.is(Role.Tutor));
});

Deno.test("Role correctly translate to string", () => {
  assertEquals(Role.Admin.toString(), "ADMIN");
  assertEquals(Role.Member.toString(), "MEMBER");
  assertEquals(Role.Tutor.toString(), "TUTOR");
});

Deno.test("Role creation from string works", () => {
  const role = new Role("ADMIN" as RoleName);
  assert(role.is(Role.Admin));
});

Deno.test("Role creation from string fails on invalid role name", () => {
  assertThrows(
    () => new Role("foo" as unknown as RoleName),
    Error,
    "invalid role name 'foo'",
  );
});
