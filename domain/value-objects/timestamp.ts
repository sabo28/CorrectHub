export enum TimeUnit {
  DAYS = 86_400_000,
  HOURS = 3_600_000,
  MINUTES = 60_000,
  SECONDS = 1000,
  MILLISECONDS = 1,
}

export default class Timestamp {
  private readonly value: Date;

  constructor(value: Date) {
    if (!value.getTime() || isNaN(value.getTime())) {
      throw new Error("invalid timestamp");
    }
    this.value = value;
  }

  toString(): string {
    return this.value.toISOString();
  }

  /**
   * Converts the timestamp to a regular Date object
   *
   * @returns the wrapped Date object
   */
  toDate(): Date {
    return this.value;
  }

  /**
   * Converts the timestamp to a unix timestamp in seconds
   *
   * @returns the unix timestamp in seconds
   */
  toUnix(): number {
    return Math.floor(this.value.getTime() / 1000);
  }

  /**
   * Converts the timestamp to a unix timestamp with milliseconds
   *
   * @returns the unix timestamp in milliseconds
   */
  toUnixMillis(): number {
    return this.value.getTime();
  }

  /**
   * Creates a new timestamp with the current time and date.
   *
   * @returns a new timestamp
   */
  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * Creates a new timestamp in the future
   *
   * @param num how many units in the future
   * @param unit the unit itself (milliseconds by default)
   * @returns a new timestamp
   */
  static in(num: number, unit: TimeUnit = TimeUnit.MILLISECONDS): Timestamp {
    const timestampRaw = Date.now() + (num * unit);
    return new Timestamp(new Date(timestampRaw));
  }

  /**
   * Creates a new timestamp from a unix timestamp.
   * Be aware that when working with JavaScript/TypeScript, this method might
   * not be the correct one to be used.
   *
   * See [fromUnixMillis] if you want to create a timestamp from milliseconds
   *
   * @param unixTimestamp the unix timestamp **WITHOUT** milliseconds
   * @returns a new timestamp
   */
  static fromUnix(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    if (date.getFullYear() > 33000) {
      throw new Error("expected unixTimestamp with seconds, got milliseconds");
    }

    return new Timestamp(date);
  }

  /**
   * Creates a new timestamp from a unix timestamp that contains milliseconds.
   * Be aware that when working with JavaScript/Typescript, this might be the
   * correct method to be used. Just make sure that the value that you have
   * actually contains milliseconds.
   *
   * @param unixTimestampWithMillis the unix timestamp **WITH** milliseconds
   * @returns a new timestamp
   */
  static fromUnixMillis(unixTimestampWithMillis: number) {
    const date = new Date(unixTimestampWithMillis);
    if (date.getFullYear() === 1970) {
      throw new Error(
        "expected unixTimestampWithMillis with milliseconds, got seconds",
      );
    }

    return new Timestamp(date);
  }
}
