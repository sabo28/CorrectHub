import { randomUser } from "../../user/test/user.ts";
import Timestamp, { TimeUnit } from "../../value-objects/timestamp.ts";
import Uuid from "../../value-objects/uuid.ts";
import PasswordResetToken from "../passwordResetToken.ts";

interface RandomPasswordResetTokenOptions {
  id?: string;
  userId?: string;
  createdAtMillis?: number;
  expiresAtMillis?: number;
}

export function randomPasswordResetToken(
  options: RandomPasswordResetTokenOptions = {},
): PasswordResetToken {
  const id = options.id ? new Uuid(options.id) : Uuid.newRandom();
  const user = randomUser();
  const userId = options.userId ? new Uuid(options.userId) : user.id;

  return new PasswordResetToken(
    id,
    userId,
    options.createdAtMillis
      ? Timestamp.fromUnixMillis(options.createdAtMillis)
      : Timestamp.now(),
    options.expiresAtMillis
      ? Timestamp.fromUnixMillis(options.expiresAtMillis)
      : Timestamp.in(30, TimeUnit.MINUTES),
  );
}
