import { randomBytes } from "node:crypto";
import Email from "../value-objects/email.ts";
import { Buffer } from "node:buffer";

/**
 * The VerificationCode encodes both an E-Mail address and random bytes
 * together.
 */
export default class VerificationCode {
  readonly email: Email;
  readonly code: Buffer;

  constructor(readonly value: string) {
    const parts = decodeParts(value);

    this.email = new Email(parts[0]);
    this.code = Buffer.from(parts[1]);
  }

  is(other: VerificationCode): boolean {
    return this.value === other.value;
  }

  verify(other: VerificationCode): boolean {
    return this.is(other);
  }

  verifyEmail(email: Email) {
    return this.email.toString() === email.toString();
  }

  verifyCode(code: Buffer) {
    return this.code.toString("hex") === code.toString("hex");
  }

  toString(): string {
    return this.value;
  }

  static from(email: Email, code: Buffer) {
    const encoded = encodeParts(email, code);
    return new VerificationCode(encoded);
  }

  static newRandom(email: Email): VerificationCode {
    const encoded = encodeParts(email, randomBytes(16));
    return new VerificationCode(encoded);
  }
}

function encodeParts(email: Email, code: Buffer): string {
  const parts = [email.toString(), code.toString()];
  return Buffer.from(parts.join(";")).toString("hex");
}

function decodeParts(hex: string): [string, Buffer] {
  const raw = Buffer.from(hex, "hex").toString("utf-8");
  const index = raw.indexOf(";");
  const email = raw.slice(0, index);
  const code = raw.slice(index + 1);

  return [email, Buffer.from(code)];
}
