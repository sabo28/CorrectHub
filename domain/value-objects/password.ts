import { hash, verify } from "jsr:@bronti/argon2";

export default class Password {
  private readonly hash: string;

  constructor(hash: string) {
    if (!/^\$argon2/.test(hash)) {
      throw new Error("invalid password hash; expected certain hash algorithm");
    }
    this.hash = hash;
  }

  toString(): string {
    return this.hash;
  }

  /**
   * Verify that an unhashed password value is actually the same as the hashed
   * value.
   * @param password unhashed password to be verified
   * @returns either true or false, depending if the password matches the
   *          hashed value
   */
  verify(password: string): boolean {
    return verify(password, this.hash);
  }

  /**
   * Creates a new Password value-object containing the hashed password
   * @param password unhashed password
   * @returns Password
   */
  static hash(password: string): Password {
    return new Password(hash(password));
  }
}
