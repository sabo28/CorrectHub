import { Pool } from "npm:pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../schema.ts";
import path from "node:path";
import { DatabaseClient } from "../db.ts";

export default async function getDb(
  databaseUrl: string,
): Promise<DatabaseClient> {
  const pgClient = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle({
    client: pgClient,
    schema,
  });

  const migrationConfig = {
    migrationsFolder: path.join(
      import.meta.dirname ?? ".",
      "../../",
      "migrations",
    ),
  };
  await migrate(db, migrationConfig);

  return db;
}
