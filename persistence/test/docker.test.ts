import { assert } from "$std/assert/assert.ts";
import { randomPortNum } from "./docker.ts";

Deno.test("randomPortNum", () => {
  const result1 = randomPortNum(0, 10);
  assert(result1 >= 0 && result1 <= 10);

  const result2 = randomPortNum(100, 20000);
  assert(result2 >= 100 && result2 <= 20000);
});
