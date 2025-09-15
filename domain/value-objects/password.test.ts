import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertNotEquals } from "$std/assert/assert_not_equals.ts";
import { assertMatch } from "$std/assert/assert_match.ts";
import { assert } from "$std/assert/assert.ts";
import { assertFalse } from "$std/assert/assert_false.ts";

import Password from "./password.ts";

Deno.test("Password successfully hashed with random salt", () => {
  const password = Password.hash("foo");
  assertNotEquals(password.toString(), "foo");
  assertMatch(password.toString(), /^\$argon2/);
  assert(password.verify("foo"));
});

Deno.test("Password successfully hashed but verification returns false with different password", () => {
  const password = Password.hash("hello_world");
  assertFalse(password.verify("1234"));
});

Deno.test("Password throws on invalid hash", () => {
  assertThrows(
    () => new Password("invalid hash"),
    Error,
    "invalid password hash; expected certain hash algorithm",
  );
});
