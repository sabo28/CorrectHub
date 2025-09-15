import { None, Option, Some } from "./option.ts";

type SyncFn<T> = () => T;

type PromiseFn<T> = () =>
  | Promise<T>
  | T;

type UnwrapResult<T, E> = T extends Result<infer U, E> ? UnwrapResult<U, E>
  : T;

export abstract class Result<T, E> {
  /**
   * Tries to compare two Results that are compatible and checks if they are
   * similar.
   *
   * @param other the other Result
   */
  abstract is(other: Result<T, E>): boolean;

  /**
   * Returns true if the Result is an Ok value.
   */
  abstract isOk(): boolean;

  /**
   * Returns true if the Result is an Err value.
   */
  abstract isErr(): boolean;

  /**
   * Converts the `Ok<T>` into a `Some<T>` if there is an Ok value.
   * Otherwise returns None.
   */
  abstract ok(): Option<T>;

  /**
   * Converts the `Err<E>` into a `Some<E>` if there is an `Err` value.
   * Otherwise returns None.
   */
  abstract err(): Option<E>;

  /**
   * Returns the `Ok` value or throws an `Error` if it is an `Err` value.
   * You probably don't want to use this most of the times and instead want to
   * use `unwrapOr` or `unwrapOrElse`.
   */
  abstract unwrap(): T;

  /**
   * Returns the `Ok` value or returns a default value.
   */
  abstract unwrapOr(defaultValue: T): T;

  /**
   * Returns the `Ok` value or computes it from a callback function.
   */
  abstract unwrapOrElse(fn: (err: E) => T): T;

  /**
   * Returns the `Err` value or throws an `Error` if it is not an `Err` value.
   */
  abstract unwrapErr(): E;

  /**
   * Returns the name of the `Error` constructor or throws if the `Err` value is
   * not an instance of `Error`
   */
  abstract unwrapErrName(): string;

  flatten<U, E>(): Result<U, E> {
    if (this.isErr()) {
      const err = this.unwrapErr();
      if (Result.isResult(err) && err.isOk()) {
        throw new Error("Err contains Ok value");
      }

      if (Result.isResult(err)) {
        return err.flatten();
      }

      return Err(err) as unknown as Result<U, E>;
    }

    const value = this.unwrap();
    if (Result.isResult(value)) {
      return value.flatten();
    }

    return Ok(value) as unknown as Result<U, E>;
  }

  /**
   * Checks if a given value is a `Result`.
   *
   * @param other the other value to be checked
   * @returns true if it is a `Result`.
   */
  static isResult<T, E>(other: unknown): other is Result<T, E> {
    return other instanceof Result || other instanceof OkImpl ||
      other instanceof ErrImpl;
  }

  /**
   * Tries to convert the result of a function into a `Result<T, E>`.
   * @param fn callback function that returns a value or throws.
   * @returns a new Result (either Ok or Err)
   */
  static async from<T, E extends Error, U>(
    fn: Promise<T> | PromiseFn<T>,
  ): Promise<Result<T, E>> {
    let callable: PromiseFn<T>;

    if (fn instanceof Promise) {
      callable = (): Promise<T> => fn;
    } else {
      callable = fn;
    }

    try {
      const result = await callable();

      return Ok(result);
    } catch (e: unknown) {
      if (Result.isResult<T, E>(e)) {
        return e;
      }

      if (e instanceof Error) {
        return Err(e as E);
      }

      throw new Error("Result::from: unexpected non-error was thrown");
    }
  }

  static fromSync<T, E extends Error>(fn: SyncFn<T>): Result<T, E> {
    try {
      const result = fn();

      return Ok(result);
    } catch (e: unknown) {
      if (Result.isResult<T, E>(e)) {
        return e;
      }

      if (e instanceof Error) {
        return Err(e as E);
      }

      throw new Error("Result::fromSync: unexpected non-error was thrown");
    }
  }
}

class OkImpl<T, E> extends Result<T, E> {
  private readonly value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  is(other: Result<T, E>): boolean {
    if (!other.isOk()) {
      return false;
    }

    const value = other.unwrap();
    const sameType = typeof value === typeof this.value;
    const sameContent = JSON.stringify(value) === JSON.stringify(this.value);

    return sameType && sameContent;
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  ok(): Option<T> {
    return Some(this.value);
  }

  err(): Option<E> {
    return None();
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  unwrapOrElse(_: (err: E) => T): T {
    return this.value;
  }

  unwrapErr(): E {
    throw new Error(`Result::unwrapErr() on an Ok value: '${this.value}'`);
  }

  unwrapErrName(): string {
    throw new Error(`Result::unwrapErrName() on an Ok value: '${this.value}'`);
  }
}

class ErrImpl<T, E> extends Result<T, E> {
  private readonly value: E;

  constructor(err: E) {
    super();
    this.value = err;
  }

  is(other: Result<T, E>): boolean {
    if (!other.isErr()) {
      return false;
    }

    const value = other.unwrapErr();
    const sameType = typeof value === typeof this.value;
    const sameContent = JSON.stringify(value) === JSON.stringify(this.value);

    return sameType && sameContent;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  ok(): Option<T> {
    return None();
  }

  err(): Option<E> {
    return Some(this.value);
  }

  unwrap(): T {
    throw new Error(`Result::unwrap() on an Err value: '${this.value}'`);
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: (err: E) => T): T {
    return fn(this.value);
  }

  unwrapErr(): E {
    return this.value;
  }

  unwrapErrName(): string {
    if (this.value == null || !(this.value instanceof Error)) {
      throw new Error(`Result::unwrapErrName() on a non Error instance`);
    }

    return this.value.constructor.name;
  }
}

export function Ok<T, E>(value: T): Result<T, E> {
  return new OkImpl(value);
}

export function Err<T, E>(value: E): Result<T, E> {
  return new ErrImpl(value);
}
