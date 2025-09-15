import {
  EmailNotVerified,
  InvalidCredentialsWithEmail,
  InvalidCredentialsWithUsername,
} from "./../domain/session/error.ts";
import { assert } from "$std/assert/assert.ts";
import { assertFalse } from "$std/assert/assert_false.ts";
import { z } from "zod/v4";
import {
  BadRequest,
  Conflict,
  ErrorResponse,
  errorResponseHandler,
  Unauthorized,
  UnsupportedMediaType,
} from "./errors.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import Email from "@domain/value-objects/email.ts";
import {
  EmailAlreadyExists,
  UsernameAlreadyExists,
} from "@domain/user/error.ts";

Deno.test("errorResponseHandler converts ZodError into BadRequest", () => {
  const TestType = z.object({
    test: z.string(),
  });
  const result = TestType.safeParse({});
  assertFalse(result.success);

  const error = result.error;
  assert(error instanceof z.ZodError);

  const response = errorResponseHandler(error);
  assertEquals(response, {
    statusCode: 400,
    type: "BadRequest",
    code: "InvalidInput",
    message:
      "✖ Invalid input: expected string, received undefined\n  → at test",
  });
});

Deno.test("errorResponseHandler converts domain error into response error", () => {
  const testCases: {
    input: Error[];
    expected: Partial<ErrorResponse>;
  }[] = [
    {
      input: [new BadRequest()],
      expected: {
        statusCode: 400,
        type: "BadRequest",
      },
    },
    {
      input: [
        new Unauthorized(),
        new InvalidCredentialsWithEmail(new Email("test@test.com")),
        new InvalidCredentialsWithUsername("test"),
      ],
      expected: {
        statusCode: 401,
        type: "Unauthorized",
      },
    },
    {
      input: [new EmailNotVerified(new Email("test@test.com"))],
      expected: {
        statusCode: 403,
        type: "Forbidden",
      },
    },
    {
      input: [
        new UsernameAlreadyExists("test"),
        new EmailAlreadyExists(new Email("test@test.com")),
        new Conflict(),
      ],
      expected: {
        statusCode: 409,
        type: "Conflict",
      },
    },
    {
      input: [new UnsupportedMediaType("text/html")],
      expected: {
        statusCode: 415,
        type: "UnsupportedMediaType",
      },
    },
    {
      input: [new Error("unknown")],
      expected: {
        statusCode: 500,
        type: "Unknown",
        code: "Unknown",
        message: "unknown error",
      },
    },
  ];

  function pickFrom<T>(full: T, partial: Partial<T>): Partial<T> {
    const output: Partial<T> = {};

    const keys = Object.keys(partial);
    for (const key of keys) {
      output[key as keyof T] = full[key as keyof T];
    }

    return output;
  }

  for (const test of testCases) {
    for (const error of test.input) {
      const actual = errorResponseHandler(error);

      assertEquals(pickFrom(actual, test.expected), test.expected);
    }
  }
});
