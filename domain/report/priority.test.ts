import { assertEquals, assertThrows } from "$std/assert/mod.ts";
import Priority from "./priority.ts";

Deno.test("new Priority throws on invalid value", () => {
  assertThrows(
    () => new Priority(1),
    Error,
    "Priority: invalid value '1'",
  );
});

Deno.test("Priority::toLocale returns localized values", async (t) => {
  const testcases = {
    10: "Niedrig",
    20: "Normal",
    30: "Hoch",
    40: "Kritisch",
  };

  for (const [val, localized] of Object.entries(testcases)) {
    await t.step(`value '${val}' should become '${localized}'`, () => {
      const p = new Priority(+val);
      assertEquals(p.toLocale(), localized);
    });
  }
});
