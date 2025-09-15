import Email from "../../value-objects/email.ts";
import Password from "../../value-objects/password.ts";
import Uuid from "../../value-objects/uuid.ts";
import User from "../user.ts";
import Timestamp from "../../value-objects/timestamp.ts";
import VerificationCode from "../verification-code.ts";
import Role from "../role.ts";

interface RandomUserOptions {
  id?: string;
  username?: string;
  password?: string;
  email?: string;
  emailVerified?: boolean;
  role?: Role;
  createdAtMillis?: number;
  updatedAtMillis?: number;
}

export function randomUser(options: RandomUserOptions = {}): User {
  const id = options.id ? new Uuid(options.id) : Uuid.newRandom();
  const email = new Email(options.email ?? "example@example.com");
  const hashedPassword = Password.hash(options.password ?? "123456");

  return new User(
    id,
    options.username ?? "Max Musterman",
    email,
    options.emailVerified ?? false,
    VerificationCode.newRandom(email),
    hashedPassword,
    options.role ? options.role : Role.Member,
    options.createdAtMillis
      ? Timestamp.fromUnixMillis(options.createdAtMillis)
      : Timestamp.now(),
    options.updatedAtMillis
      ? Timestamp.fromUnixMillis(options.updatedAtMillis)
      : Timestamp.now(),
  );
}

export function randomUserAs(role: Role): User {
  return randomUser({ role });
}
