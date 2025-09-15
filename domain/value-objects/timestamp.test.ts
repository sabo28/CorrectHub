import { assertThrows } from "$std/assert/assert_throws.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import Timestamp from "./timestamp.ts";

Deno.test("Timestamp successfully created", () => {
  const now = new Date();
  const timestamp = new Timestamp(now);
  assertEquals(timestamp.toDate(), now);
  assertEquals(timestamp.toString(), now.toISOString());
});

Deno.test("Timestamp throws error on invalid date", () => {
  assertThrows(
    () => new Timestamp(new Date("invalid")),
    Error,
    "invalid timestamp",
  );
});

Deno.test("Timestamp correctly converts into unix timestamps", () => {
  const unixTimestamp = 1747563165;
  const unixTimestampWithMillis = unixTimestamp * 1000;

  const date = new Date(unixTimestampWithMillis);
  const timestamp = new Timestamp(date);

  assertEquals(timestamp.toUnix(), unixTimestamp);
  assertEquals(timestamp.toUnixMillis(), unixTimestampWithMillis);
});

Deno.test("Timestamp correctly created from unix timestamps", async (t) => {
  const unixTimestamp = 1747563165;
  const unixTimestampWithMillis = unixTimestamp * 1000;
  const expected = "2025-05-18T10:12:45.000Z";

  await t.step("from seconds", () => {
    const timestamp = Timestamp.fromUnix(unixTimestamp);
    assertEquals(timestamp.toString(), expected);
  });

  await t.step("from millis", () => {
    const timestamp = Timestamp.fromUnixMillis(unixTimestampWithMillis);
    assertEquals(timestamp.toString(), expected);
  });
});

Deno.test("Timestamp creation fromUnix with millis fails", () => {
  const unixTimestampWithMillis = 1747563165000;
  assertThrows(
    () => Timestamp.fromUnix(unixTimestampWithMillis),
    Error,
    "expected unixTimestamp with seconds",
  );
});

Deno.test("Timestamp creation fromUnixMillis with seconds fails", () => {
  const unixTimestamp = 1747563165;
  assertThrows(
    () => Timestamp.fromUnixMillis(unixTimestamp),
    Error,
    "expected unixTimestampWithMillis with milliseconds",
  );
});
