import randomReport from "@domain/report/test/report.ts";
import { assertEquals } from "$std/assert/mod.ts";

Deno.test("Report.clone clones full report", () => {
  const report = randomReport({ assigneeUsername: "Testuser" });

  const cloned = report.clone();

  assertEquals(
    JSON.stringify(cloned.toPrimitive(), null, 2),
    JSON.stringify(report.toPrimitive(), null, 2),
  );
  assertEquals(cloned.assignee?.username, "Testuser");
});
