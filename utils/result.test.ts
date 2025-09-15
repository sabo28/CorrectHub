import { assert } from "$std/assert/assert.ts";
import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import { Err, Ok, Result } from "./result.ts";
import { assertFalse } from "$std/assert/assert_false.ts";
import { assertIsError } from "$std/assert/assert_is_error.ts";

Deno.test("Result::from throws when a non-error type is thrown", async () => {
  await assertRejects(
    () =>
      Result.from(
        () => {
          throw "non-error";
        },
      ),
    Error,
    "Result::from: unexpected non-error was thrown",
  );
});

Deno.test("Result::from converts value into Ok", async () => {
  const result = await Result.from(Promise.resolve("test"));
  assert(result.isOk());
  assertFalse(result.isErr());
  assertEquals(result.unwrap(), "test");
});

Deno.test("Result::from converts error into Err", async () => {
  const result = await Result.from(Promise.reject(new Error("an error")));
  assert(result.isErr());
  assertFalse(result.isOk());
  assertIsError(result.unwrapErr(), Error, "an error");
});

Deno.test("Result::from wraps Result", async () => {
  const result = await Result.from(() => Promise.resolve(Ok("foo")));
  assert(result.isOk());
  assertEquals(result.unwrap().unwrap(), "foo");
});

Deno.test("Result::from wraps error into Err", async () => {
  const result = await Result.from(() => Promise.reject(new Error("error")));
  assert(result.isErr());
  assertEquals(result.unwrapErr().message, "error");
});

Deno.test("Result::fromSync wraps Result", () => {
  const result = Result.fromSync(() => Ok("foo"));
  assert(result.isOk());
  assertEquals(result.unwrap().unwrap(), "foo");
});

Deno.test("Result::fromSync wraps caught error into Err", () => {
  const result = Result.fromSync(() => {
    throw new Error("hello world");
  });
  assert(result.isErr());
  assertEquals(result.unwrapErr().message, "hello world");
});

Deno.test("Result::flatten converts a wrapped Result into a single Result", () => {
  const inception = Ok(Ok(Ok("foo")));
  assertEquals(inception.flatten().unwrap(), "foo");

  const errorInception = Err(Err("bar"));
  assertEquals(errorInception.flatten().unwrapErr(), "bar");
});

Deno.test("Result::flatten fails if an Err contains Ok value", () => {
  const inception = Ok(Err(Ok("foo")));
  assertThrows(
    () => inception.flatten(),
    Error,
    "Err contains Ok value",
  );
});

Deno.test("Result::isOk", () => {
  assert(Ok("test").isOk());
  assert(!Err("test").isOk());
});

Deno.test("Result::isErr", () => {
  assert(!Ok("test").isErr());
  assert(Err("test").isErr());
});

Deno.test("Result::ok", () => {
  assertEquals(Ok("test").ok().unwrap(), "test");
  assert(Err("test").ok().isNone());
});

Deno.test("Result::err", () => {
  assert(Ok("test").err().isNone());
  assertEquals(Err("test").err().unwrap(), "test");
});

Deno.test("Result::unwrap", () => {
  {
    const result = Err("foo");
    assertThrows(
      () => result.unwrap(),
      Error,
      "Result::unwrap() on an Err value",
    );
  }

  {
    const result = Ok("foo");
    assertEquals(result.unwrap(), "foo");
  }
});

Deno.test("Result::unwrapOr", () => {
  let result = Ok("foo");
  assertEquals(result.unwrapOr("test"), "foo");

  result = Err("err value");
  assertEquals(result.unwrapOr("test"), "test");
});

Deno.test("Result::unwrapOrElse", () => {
  let result = Ok<string, Error>("foo");
  assertEquals(result.unwrapOrElse((err: Error) => err.message), "foo");

  result = Err(new Error("the message"));
  assertEquals(result.unwrapOrElse((err: Error) => err.message), "the message");
});

Deno.test("Result::unwrapErr", () => {
  {
    const result = Ok("foo");
    assertThrows(
      () => result.unwrapErr(),
      Error,
      "Result::unwrapErr() on an Ok value",
    );
  }

  {
    const result = Err("foo");
    assertEquals(result.unwrapErr(), "foo");
  }
});

Deno.test("Result::is", async (t) => {
  const testCases: {
    name: string;
    // deno-lint-ignore no-explicit-any
    valueA: Result<any, any>;
    // deno-lint-ignore no-explicit-any
    valueB: Result<any, any>;
    expected: boolean;
  }[] = [
    {
      name: "same Ok value",
      valueA: Ok("foo"),
      valueB: Ok("foo"),
      expected: true,
    },
    {
      name: "both Ok but different value",
      valueA: Ok("foo"),
      valueB: Ok("bar"),
      expected: false,
    },
    {
      name: "same Err value",
      valueA: Err("foo"),
      valueB: Err("foo"),
      expected: true,
    },
    {
      name: "both Err but different value",
      valueA: Err("foo"),
      valueB: Err("bar"),
      expected: false,
    },
    {
      name: "Ok is not Err",
      valueA: Ok("foo"),
      valueB: Err("foo"),
      expected: false,
    },
    {
      name: "Err is not Ok",
      valueA: Err("foo"),
      valueB: Ok("foo"),
      expected: false,
    },
  ];

  for (const test of testCases) {
    await t.step(test.name, () => {
      assertEquals(test.valueA.is(test.valueB), test.expected);
    });
  }
});
