export abstract class Option<T> {
  /**
   * Returns true if the Option is a Some value.
   */
  abstract isSome(): boolean;

  /**
   * Returns true if the Option is a None value.
   */
  abstract isNone(): boolean;

  /**
   * Returns the `Some` value or throws an `Error` if it is a `None` value.
   * You probably don't want to use this most of the times and instead want to
   * use `unwrapOr` or `unwrapOrElse`.
   */
  abstract unwrap(): T;

  /**
   * Returns the `Some` value or returns a default value.
   */
  abstract unwrapOr(defaultValue: T): T;

  /**
   * Returns the `Some` value or computes it from a callback function.
   */
  abstract unwrapOrElse(fn: () => T): T;

  static from<T>(value: T | null | undefined): Option<T> {
    if (value == null) {
      return None();
    }

    return Some(value);
  }
}

class SomeImpl<T> implements Option<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_: T): T {
    return this.value;
  }

  unwrapOrElse(_: () => T): T {
    return this.value;
  }
}

class NoneImpl<T> implements Option<T> {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  unwrap(): T {
    throw new Error("Option::unwrap() on a None value");
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse(fn: () => T): T {
    return fn();
  }
}

export function Some<T>(value: T): Option<T> {
  return new SomeImpl(value);
}

export function None<T>(): Option<T> {
  return new NoneImpl();
}
