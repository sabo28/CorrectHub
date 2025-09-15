import Uuid from "@domain/value-objects/uuid.ts";
import UserTransferObject from "./userTransferObject.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import VerificationCode from "@domain/user/verification-code.ts";
import Email from "@domain/value-objects/email.ts";
import { assert, assertEquals } from "$std/assert/mod.ts";
import Password from "@domain/value-objects/password.ts";
import Role from "@domain/user/role.ts";

Deno.test("UserTransferObject defaults empty user role", () => {
  const id = Uuid.newRandom();
  const email = new Email("foo@foo.com");
  const transfer = new UserTransferObject({
    id: id.toString(),
    username: "foo",
    email: email.toString(),
    emailVerified: true,
    verificationCode: VerificationCode.newRandom(email).toString(),
    password: Password.hash("foo").toString(),
    role: "",
    createdAt: Timestamp.now().toDate(),
    updatedAt: Timestamp.now().toDate(),
  });

  const user = transfer.toUser();
  assertEquals(user.id.toString(), id.toString());
  assert(user.role.is(Role.Member));
});
