import { assertRejects } from "$std/assert/assert_rejects.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { UserService } from "@domain/user/service.ts";
import UserTestRepository from "@domain/user/test/repository.ts";
import { assert } from "$std/assert/assert.ts";
import UserHandler from "./user-handler.ts";
import { EventService } from "@domain/event/service.ts";
import { z } from "zod/v4";
import { UsernameAlreadyExists } from "@domain/user/error.ts";

// TODO: test multiform
Deno.test("UserHandler.create creates user with application/json", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());
  const handler = new UserHandler(service);

  const userRequestBody = {
    username: "Max Mustermann",
    email: "sdlfkj@sdlkfj.com",
    password: "1234",
  };

  const request = new Request("http://localhost/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userRequestBody),
  });

  const body = await handler.create(request);
  const user = await repository.getById(new Uuid(body.id));

  assertEquals(body.id, user.id.toString());
  assertEquals(body.username, user.username);
  assertEquals(body.email, user.email.toString());
  assertEquals(body.role, user.role.toString());
  assert(user.password.verify(userRequestBody.password));
});

Deno.test("UserHandler.create fails when username already exists", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());
  const handler = new UserHandler(service);

  const userRequestBody = {
    username: "max",
    password: "1234",
  };

  const createRequest = (email: string) =>
    new Request("http://localhost/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userRequestBody,
        email,
      }),
    });

  await handler.create(createRequest("test1@foo.bar"));

  // Create same user again
  assertRejects(
    () => handler.create(createRequest("test2@foo.bar")),
    UsernameAlreadyExists,
    `User with username 'max' already exists`,
  );
});

Deno.test("UserHandler.create fails when input is invalid", async () => {
  const repository = new UserTestRepository();
  const service = new UserService(repository, new EventService());
  const handler = new UserHandler(service);

  const userRequestBody = {
    name: "Max Mustermann",
    password: "1234",
  };

  const request = new Request("http://localhost/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userRequestBody),
  });

  try {
    await handler.create(request);
    assert(false, "previous method should have rejected");
  } catch (e: unknown) {
    assert(e instanceof z.ZodError, "error is of type ZodError");
    assertEquals(e.issues.length, 2);

    assertEquals(e.issues[0].path, ["username"]);
    assertEquals(
      e.issues[0].message,
      "Invalid input: expected string, received undefined",
    );

    assertEquals(e.issues[1].path, ["email"]);
    assertEquals(
      e.issues[1].message,
      "Invalid input: expected string, received undefined",
    );
  }
});
