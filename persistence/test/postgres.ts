import { Buffer } from "node:buffer";
import Container, { DOCKER, runRetry } from "./docker.ts";
import { None, Option, Some } from "@utils/option.ts";

export default class PostgresContainer extends Container {
  private port: Option<number> = None();

  constructor(
    private readonly username = "test",
    private readonly password = "test",
    private readonly database = "test",
  ) {
    super("postgres:17-alpine", {}, {
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: database,
    });
  }

  override start(): Promise<void> {
    const port = this.exposePort(5432);
    this.port = Some(port);

    return super.start();
  }

  get databaseUrl(): string {
    return `postgresql://${this.username}:${this.password}@${this.host}:${this.port.unwrap()}/${this.database}`;
  }

  protected override async waitStrategy(): Promise<void> {
    await runRetry(async () => {
      const command = new Deno.Command(DOCKER, {
        args: [
          "exec",
          "-e",
          `PGPASSWORD=${this.password}`,
          this.containerId.unwrap(),
          "pg_isready",
          "--host",
          "localhost",
          "--username",
          this.username,
          "--dbname",
          this.database,
        ],
      });

      const output = await command.output();

      if (output.code !== 0) {
        if (output.stderr.length) {
          console.error(Buffer.from(output.stderr).toString());
        }
        throw new Error("failed waiting for postgres container to be ready");
      }
    });

    return Promise.resolve();
  }
}
