import { assertEquals } from "$std/assert/mod.ts";
import { randomUser } from "./test/user.ts";
import User, { IPrimitiveUser } from "./user.ts";

Deno.test("User.toPrimitive", () => {
  const user = randomUser();
  const primitive = user.toPrimitive();

  assertEquals(primitive, {
    id: user.id.toString(),
    username: user.username,
    email: user.email.toString(),
    emailVerified: user.emailVerified,
    role: user.role.toString(),
    createdAtMillis: user.createdAt.toUnixMillis(),
    updatedAtMillis: user.updatedAt.toUnixMillis(),
  });
});

Deno.test("User field mappings", async (t) => {
  const primitiveFields = {
    "id": "id",
    "username": "username",
    "email": "email",
    "emailVerified": "emailVerified",
    "role": "role",
    "createdAt": "createdAtMillis",
    "updatedAt": "updatedAtMillis",
  };

  for (const [userField, primitiveField] of Object.entries(primitiveFields)) {
    await t.step(`${userField} <-> ${primitiveField}`, () => {
      assertEquals(
        User.fieldToPrimitiveMap(userField as keyof User),
        primitiveField,
      );

      assertEquals(
        User.primitiveToFieldMap(primitiveField as keyof IPrimitiveUser),
        userField,
      );
    });
  }
});
