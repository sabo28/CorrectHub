import User from "./user.ts";
import Uuid from "../value-objects/uuid.ts";
import Email from "../value-objects/email.ts";
import Password from "../value-objects/password.ts";
import VerificationCode from "./verification-code.ts";
import Role from "./role.ts";
import Timestamp from "../value-objects/timestamp.ts";
import { assert, assertFalse } from "$std/assert/mod.ts";
import { randomUserAs } from "./test/user.ts";

Deno.test("UserPermission has a implicit role and create a report", () => {
  const id = Uuid.newRandom();
  const email = new Email("example@example.com");
  const hashedPassword = Password.hash("123456");

  const user = new User(
    id,
    "Max Musterman",
    email,
    false,
    VerificationCode.newRandom(email),
    hashedPassword,
    Role.Member,
    Timestamp.now(),
    Timestamp.now(),
  );

  assert(
    user.permissions.has(user.role),
    "User should have implicit role permission",
  );
  assert(
    user.permissions.canCreateReport(),
    "User should be able to create a report",
  );
});

Deno.test("UserPermission is Admin", () => {
  const id = Uuid.newRandom();
  const email = new Email("example@example.com");
  const hashedPassword = Password.hash("123456");

  const user = new User(
    id,
    "Max Musterman",
    email,
    false,
    VerificationCode.newRandom(email),
    hashedPassword,
    Role.Admin,
    Timestamp.now(),
    Timestamp.now(),
  );

  assert(user.permissions.isAdmin(), "User should be an admin");
});

Deno.test("UserPermission can edit report", () => {
  const id = Uuid.newRandom();
  const email = new Email("example@example.com");
  const hashedPassword = Password.hash("123456");

  const user = new User(
    id,
    "Max Musterman",
    email,
    false,
    VerificationCode.newRandom(email),
    hashedPassword,
    Role.Member,
    Timestamp.now(),
    Timestamp.now(),
  );

  assert(
    user.permissions.canEditReport(user.id),
    "User should be able to edit their own report",
  );
});

Deno.test("UserPermission has one of roles", () => {
  const id = Uuid.newRandom();
  const email = new Email("example@example.com");
  const hashedPassword = Password.hash("123456");

  const user = new User(
    id,
    "Max Musterman",
    email,
    false,
    VerificationCode.newRandom(email),
    hashedPassword,
    Role.Tutor,
    Timestamp.now(),
    Timestamp.now(),
  );

  assert(
    user.permissions.hasOneOf([Role.Admin, Role.Tutor]),
    "User should have one of the specified roles",
  );
  assert(
    user.permissions.hasOneOf([Role.Member, Role.Tutor]),
    "User should have one of the specified roles",
  );
  assertFalse(
    user.permissions.hasOneOf([Role.Admin, Role.Member]),
    "User should not have one of the specified roles",
  );
  assertFalse(
    user.permissions.hasOneOf([Role.Member]),
    "User should not have the specified roles if none match",
  );
});

Deno.test("canViewAllReports", () => {
  assert(randomUserAs(Role.Admin).permissions.canViewAllReports());
  assert(randomUserAs(Role.Tutor).permissions.canViewAllReports());
  assertFalse(randomUserAs(Role.Member).permissions.canViewAllReports());
});

Deno.test("canViewUsers", () => {
  assert(randomUserAs(Role.Admin).permissions.canViewUsers());
  assert(randomUserAs(Role.Tutor).permissions.canViewUsers());
  assertFalse(randomUserAs(Role.Member).permissions.canViewUsers());
});

Deno.test("canChangeUserRole", () => {
  assert(randomUserAs(Role.Admin).permissions.canChangeUserRole());
  assertFalse(randomUserAs(Role.Tutor).permissions.canChangeUserRole());
  assertFalse(randomUserAs(Role.Member).permissions.canChangeUserRole());
});

Deno.test("canViewReport", () => {
  const author = randomUserAs(Role.Member);

  assert(author.permissions.canViewReport(author.id));
  assert(randomUserAs(Role.Admin).permissions.canViewReport(author.id));
  assert(randomUserAs(Role.Tutor).permissions.canViewReport(author.id));
  assertFalse(randomUserAs(Role.Member).permissions.canViewReport(author.id));
});

Deno.test("canEditReport", () => {
  const author = randomUserAs(Role.Member);

  assert(author.permissions.canEditReport(author.id));
  assert(randomUserAs(Role.Admin).permissions.canEditReport(author.id));
  assert(randomUserAs(Role.Tutor).permissions.canEditReport(author.id));
  assertFalse(randomUserAs(Role.Member).permissions.canEditReport(author.id));
});

Deno.test("canChangeStatus", () => {
  assert(randomUserAs(Role.Admin).permissions.canChangeStatus());
  assert(randomUserAs(Role.Tutor).permissions.canChangeStatus());
  assertFalse(randomUserAs(Role.Member).permissions.canChangeStatus());
});

Deno.test("canChangePriority", () => {
  assert(randomUserAs(Role.Admin).permissions.canChangePriority());
  assert(randomUserAs(Role.Tutor).permissions.canChangePriority());
  assertFalse(randomUserAs(Role.Member).permissions.canChangePriority());
});

Deno.test("canChangeAssignee", () => {
  assert(randomUserAs(Role.Admin).permissions.canChangeAssignee());
  assert(randomUserAs(Role.Tutor).permissions.canChangeAssignee());
  assertFalse(randomUserAs(Role.Member).permissions.canChangeAssignee());
});

Deno.test("canCreateComment", () => {
  const author = randomUserAs(Role.Member);

  assert(author.permissions.canCreateComment(author.id));
  assert(randomUserAs(Role.Admin).permissions.canCreateComment(author.id));
  assert(randomUserAs(Role.Tutor).permissions.canCreateComment(author.id));
  assertFalse(
    randomUserAs(Role.Member).permissions.canCreateComment(author.id),
  );
});
