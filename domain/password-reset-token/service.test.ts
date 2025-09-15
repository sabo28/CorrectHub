import UserTestRepository from "../user/test/repository.ts";
import PasswordResetTokenTestRepository from "./test/repository.ts";
import { EventService } from "../event/service.ts";
import PasswordResetTokenService from "./service.ts";
import { randomUser } from "../user/test/user.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

Deno.test("PasswordResetTokenService.resetPassword creates a new password reset token", async () => {
  const userRepo = new UserTestRepository();
  const resetTokenRepo = new PasswordResetTokenTestRepository();
  const eventService = new EventService();
  const service = new PasswordResetTokenService(
    userRepo,
    resetTokenRepo,
    eventService,
  );

  const user = randomUser();
  await userRepo.save(user);

  const token = await service.resetPassword(user.email.toString());

  assertEquals(token.userId.toString(), user.id.toString());
});

Deno.test("PasswordResetTokenService.findById retrieves a password reset token by ID", async () => {
  const userRepo = new UserTestRepository();
  const resetTokenRepo = new PasswordResetTokenTestRepository();
  const eventService = new EventService();
  const service = new PasswordResetTokenService(
    userRepo,
    resetTokenRepo,
    eventService,
  );

  const user = randomUser();
  await userRepo.save(user);

  const token = await service.resetPassword(user.email.toString());

  const foundToken = await service.findById(token.id);

  assertEquals(foundToken.id.toString(), token.id.toString());
  assertEquals(foundToken.userId.toString(), user.id.toString());
  assertEquals(foundToken.expiresAt.toString(), token.expiresAt.toString());
});
