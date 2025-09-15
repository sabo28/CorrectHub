import { assertEquals } from "$std/assert/assert_equals.ts";
import { assert } from "$std/assert/assert.ts";
import { BadRequest, UnsupportedMediaType } from "@handler/errors.ts";
import { requestDataToObject } from "./requestDataToObject.ts";

Deno.test("requestDataToObject with correct JSON Content-Type and body returns object", async () => {
  const expected = { test: true };
  const request = new Request("http://localhost/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expected),
  });

  const result = await requestDataToObject(request);
  assert(result.isOk());
  assertEquals(result.unwrap(), expected);
});

Deno.test("requestDataToObject with correct FormData Content-Type and body returns object", async () => {
  const formData = new FormData();
  formData.append("username", "foo");
  formData.append("arr", "1");
  formData.append("arr", "2");

  const request = new Request("http://localhost/api/user", {
    method: "POST",
    body: formData,
  });

  const result = await requestDataToObject(request);
  assert(result.isOk());
  assertEquals(result.unwrap(), { username: "foo", arr: ["1", "2"] });
});

Deno.test("requestDataToObject with missing Content-Type returns BadRequest", async () => {
  const request = new Request("http://localhost/api/user");

  const result = await requestDataToObject(request);
  assert(result.isErr());
  assert(result.unwrapErr() instanceof BadRequest);
  assertEquals(result.unwrapErr().message, "missing Content-Type header");
});

Deno.test("requestDataToObject with unsupported Content-Type returns UnsupportedMediaType", async () => {
  const request = new Request("http://localhost/api/user", {
    headers: {
      "Content-Type": "plain/text",
    },
  });

  const result = await requestDataToObject(request);
  assert(result.isErr());
  assert(result.unwrapErr() instanceof UnsupportedMediaType);
  assertEquals(
    result.unwrapErr().message,
    "unsupported Content-Type 'plain/text'",
  );
});

Deno.test("requestDataToObject with correct JSON Content-Type but missing body returns BadRequest", async () => {
  const request = new Request("http://localhost/api/user", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await requestDataToObject(request);
  assert(result.isErr(), "should be error");
  assert(
    result.unwrapErr() instanceof BadRequest,
    "error is of type BadRequest",
  );
  assertEquals(result.unwrapErr().message, "empty body");
});

Deno.test("requestDataToObject with correct FormData Content-Type but missing body returns BadRequest", async () => {
  const request = new Request("http://localhost/api/user", {
    headers: {
      "Content-Type": "multipart/form-data;-----",
    },
  });

  const result = await requestDataToObject(request);
  assert(result.isErr(), "should be error");
  assert(
    result.unwrapErr() instanceof BadRequest,
    "error is of type BadRequest",
  );
  assertEquals(result.unwrapErr().message, "unable to parse form data");
});
