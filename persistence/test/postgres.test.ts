import { assertEquals } from "$std/assert/assert_equals.ts";
import { Pool } from "npm:pg";
import PostgresContainer from "./postgres.ts";

Deno.test("Container and PostgresContainer correctly start up a database", async (t) => {
  const container = new PostgresContainer();
  await container.start();

  await t.step("send query", async () => {
    const client = new Pool({
      connectionString: container.databaseUrl,
    });

    const result = await client.query("SELECT 1;");
    assertEquals(result.rows, [{ "?column?": 1 }]);
  });

  await t.step("stop container", async () => {
    await container.stop();
  });
});
