import { Buffer } from "node:buffer";
import { None, Option, Some } from "@utils/option.ts";

export const DOCKER = "docker";
const DELAY_FOR_HEALTH_MS = 250;

export default class Container {
  protected containerId: Option<string> = None();
  protected host = "127.0.0.1";

  constructor(
    private readonly image: string,
    private ports: Record<string | number, number> = {},
    private readonly envs: Record<string, string> = {},
  ) {}

  /**
   * Starts the container
   */
  async start(): Promise<void> {
    const command = new Deno.Command(DOCKER, {
      args: [
        "run",
        "--rm",
        "-d",
        ...this.getExposedPortArgs(),
        ...this.getEnvironmentArgs(),
        this.image,
      ],
    });
    const result = await command.output();

    // Check stderr output
    const stderr = result.stderr;
    if (stderr.length) {
      console.error(Buffer.from(stderr).toString());
    }

    // Check stdout output and fail if it is empty
    const stdout = result.stdout;
    if (!stdout.length) {
      throw new Error("missing container output");
    }

    // Assume the stdout output contains the container ID and fail if it is
    // empty.
    const containerId = Buffer.from(stdout).toString().trim();
    if (!containerId) {
      throw new Error("missing container ID");
    }

    if (result.code !== 0) {
      throw new Error("failed creating container");
    }

    this.containerId = Some(containerId);

    await this.waitStrategy();
  }

  /**
   * Stops the container if possible
   */
  async stop(): Promise<void> {
    if (this.containerId.isNone()) {
      throw new Error("container is not running");
    }

    const command = new Deno.Command(DOCKER, {
      args: [
        "stop",
        this.containerId.unwrap(),
      ],
    });

    const result = await command.output();

    if (result.stderr.length) {
      console.error(Buffer.from(result.stderr).toString());
    }

    if (result.code !== 0) {
      throw new Error(
        `failed stopping container with id: ${this.containerId.unwrap()}`,
      );
    }
  }

  /**
   * Gets a random port to expose on the host and maps it to a guest port.
   */
  exposePort(guestPort: number): number {
    const hostPort = randomPortNum();

    this.ports[hostPort] = guestPort;

    return hostPort;
  }

  /**
   * Stub for a waiting strategy
   */
  protected waitStrategy(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Converts given ports to an array of arguments for docker
   */
  private getExposedPortArgs(): string[] {
    const portArgs: string[] = [];
    Object.entries(this.ports).forEach(([hostPort, guestPort]) => {
      portArgs.push(
        "-p",
        `${this.host}:${hostPort}:${guestPort}`,
      );
    });

    return portArgs;
  }

  /**
   * Converts given this.envs to an array of arguments for docker
   */
  private getEnvironmentArgs(): string[] {
    const output: string[] = [];
    Object.entries(this.envs).forEach(([name, val]) => {
      output.push(
        "-e",
        `${name}=${val}`,
      );
    });

    return output;
  }
}

/**
 * Runs a callback function as long as it returns an error or as long as retries
 * are left.
 */
export async function runRetry(
  fn: () => Promise<void>,
  delay = DELAY_FOR_HEALTH_MS,
  retries = 1000,
): Promise<void> {
  try {
    await fn();
    return;
  } catch (err) {
    if (!retries) {
      throw err;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, delay));
  await runRetry(fn, delay, retries - 1);
}

export function randomPortNum(min = 11000, max = 65000) {
  const range = max - min + 1;
  const maxUint32 = 0xFFFFFFFF;
  const limit = maxUint32 - (maxUint32 % range);

  let rand: number;
  do {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= limit); // Rejection sampling

  return min + (rand % range);
}
