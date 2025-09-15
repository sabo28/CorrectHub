import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

import Email from "./email.ts";

Deno.test("Email throws when invalid format", () => {
  assertThrows(() => new Email("foo"), Error, "invalid email address: 'foo'");
});

Deno.test("Email correctly created", () => {
  const email = new Email("foo@bar.com");
  assertEquals(email.toString(), "foo@bar.com");
});

Deno.test("Email is case-insensitive", () => {
  const email = new Email("HelloWorld@EXAMPLE.COM");
  assertEquals(email.toString(), "helloworld@example.com");
});

Deno.test("Email allows for certain special chars", () => {
  const email = new Email("hello+world@example.com");
  assertEquals(email.toString(), "hello+world@example.com");
});

Deno.test("Email clones other email", () => {
  const email = new Email("FOO@bar.com");
  const clonedEmail = new Email(email);
  assertEquals(email.toString(), clonedEmail.toString());
});
