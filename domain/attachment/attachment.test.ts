import { assertThrows } from "$std/assert/assert_throws.ts";
import Attachment from "@domain/attachment/attachment.ts";

Deno.test("new Attachment fails on missing parameters", async (t) => {
  const testcases = [
    {
      args: [],
      expected: "missing id",
    },
    {
      args: [1],
      expected: "missing reportId",
    },
    {
      args: [1, 1],
      expected: "missing createdBy",
    },
    {
      args: [1, 1, 1],
      expected: "missing mime",
    },
    {
      args: [1, 1, 1, 1],
      expected: "missing data",
    },
    {
      args: [1, 1, 1, 1, 1],
      expected: "missing createdAt",
    },
    {
      args: [1, 1, 1, 1, 1, 1],
      expected: "missing updatedAt",
    },
  ];

  for (const test of testcases) {
    await t.step(test.expected, () => {
      assertThrows(
        // @ts-expect-error: Testing missing parameters
        () => new Attachment(...test.args),
        Error,
        test.expected,
      );
    });
  }
});
