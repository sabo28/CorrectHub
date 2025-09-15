import { Buffer } from "node:buffer";
import {
  assert,
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "$std/assert/mod.ts";
import Email from "../value-objects/email.ts";
import VerificationCode from "./verification-code.ts";

Deno.test("VerificationCode.newRandom generates a new verification code for an email object", () => {
  const email = new Email("foo@bar.com");
  const verificationCode = VerificationCode.newRandom(email);

  assertEquals(verificationCode.email.toString(), email.toString());
});

Deno.test("VerificationCode parses verification code correctly", () => {
  const verificationCode = new VerificationCode(
    "68656c6c6f40776f726c642e636f6d3b7370656369616c2d636f64653b776974682424",
  );

  assertEquals(
    verificationCode.code,
    Buffer.from("special-code;with$$"),
  );
  assertEquals(verificationCode.email.toString(), "hello@world.com");
});

Deno.test("VerificationCode.from correctly creates verification code", () => {
  const expected = new VerificationCode(
    "68656c6c6f40776f726c642e636f6d3b6159efbfbdefbfbd2e25efbfbdefbfbd573befbfbd2e790170",
  );

  const email = new Email("hello@world.com");
  const verificationCode = VerificationCode.from(
    email,
    Buffer.from("YVnvv73vv70uJe+/ve+/vVc777+9LnkBcA==", "base64"),
  );

  assertEquals(verificationCode.toString(), expected.toString());
  assert(verificationCode.is(expected));
});

Deno.test("VerificationCode verifies given code", () => {
  const verificationCode = new VerificationCode(
    "68656c6c6f406578616d706c652e636f6d3b74657374",
  );

  assert(verificationCode.verifyCode(Buffer.from("test")));
  assert(verificationCode.verifyEmail(new Email("hello@example.com")));
});

Deno.test("VerificationCode parsing fails on invalid code", () => {
  assertThrows(
    () => new VerificationCode("foo"),
    Error,
    "invalid email address",
  );
});

Deno.test("VerificationCode.verify compares and checks against other verification code", () => {
  const verificationCode = new VerificationCode(
    "68656c6c6f406578616d706c652e636f6d3b74657374",
  );

  assert(verificationCode.verify(verificationCode));
});

Deno.test("VerificationCode.newRandom generates random codes", () => {
  const email = new Email("test@test.com");

  const verificationCode1 = VerificationCode.newRandom(email);
  const verificationCode2 = VerificationCode.newRandom(email);

  assertNotEquals(verificationCode1.toString(), verificationCode2.toString());
  assertEquals(verificationCode1.email.toString(), email.toString());
  assertEquals(verificationCode2.email.toString(), email.toString());
});
