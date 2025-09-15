import { Pool } from "npm:pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./schema.ts";
import path from "node:path";

const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema,
});

export type DatabaseClient = typeof db;

export default async function createDatabaseClientWithMigration(): Promise<
  DatabaseClient
> {
  const migrationConfig = {
    migrationsFolder: path.join(
      import.meta.dirname ?? ".",
      "../",
      "migrations",
    ),
  };
  await migrate(db, migrationConfig);

  return db;
}
