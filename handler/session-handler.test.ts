import { assertEquals } from "$std/assert/assert_equals.ts";
import UserTestRepository from "@domain/user/test/repository.ts";
import SessionTestRepository from "@domain/session/test/repository.ts";
import { SessionService } from "@domain/session/service.ts";
import SessionHandler from "./session-handler.ts";
import { assertRejects } from "$std/assert/assert_rejects.ts";
import { ZodError } from "zod/v4";
import { randomUser } from "@domain/user/test/user.ts";
import { randomSession } from "@domain/session/test/session.ts";
import newTestSiteConfiguration from "@domain/site-configuration/test/site-configuration.ts";
import { BadRequest } from "./errors.ts";

Deno.test("SessionHandler.login throws validation error on invalid input", async () => {
  const userRepository = new UserTestRepository();
  const sessionRepository = new SessionTestRepository();
  const service = new SessionService(userRepository, sessionRepository);
  const handler = new SessionHandler(service);

  const request = new Request("http://example.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  await assertRejects(
    () => handler.login(request),
    ZodError,
  );
});

Deno.test("SessionHandler.login creates session on valid user credentials", async () => {
  const userRepository = new UserTestRepository();
  const sessionRepository = new SessionTestRepository();
  const service = new SessionService(userRepository, sessionRepository);
  const handler = new SessionHandler(service);

  const user = randomUser();
  user.emailVerified = true;
  await userRepository.save(user);

  const request = new Request("http://example.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier: "example@example.com",
      password: "123456",
    }),
  });

  const result = await handler.login(request);
  assertEquals(result.user_id, user.id.toString());
});

Deno.test("SessionHandler.logout throws BadRequest on missing cookie", async () => {
  const userRepository = new UserTestRepository();
  const sessionRepository = new SessionTestRepository();
  const siteConfiguration = newTestSiteConfiguration();
  const service = new SessionService(userRepository, sessionRepository);
  const handler = new SessionHandler(service);

  const request = new Request("http://example.com", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  await assertRejects(
    () => handler.logout(request, siteConfiguration),
    BadRequest,
    "invalid session cookie",
  );
});

Deno.test("SessionHandler.logout unsets session cookie", async () => {
  const userRepository = new UserTestRepository();
  const sessionRepository = new SessionTestRepository();
  const siteConfiguration = newTestSiteConfiguration();
  const service = new SessionService(userRepository, sessionRepository);
  const handler = new SessionHandler(service);

  const user = randomUser();
  user.emailVerified = true;
  await userRepository.save(user);

  const session = randomSession(user.id);
  await sessionRepository.save(session);

  const request = new Request("http://example.com", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie":
        `${siteConfiguration.sessionCookieName}=${session.id.toString()}`,
    },
  });

  const [response, sessionResponse] = await handler.logout(
    request,
    siteConfiguration,
  );
  const setCookieHeader = response.headers.get("set-cookie");
  assertEquals(
    setCookieHeader,
    `${siteConfiguration.sessionCookieName}=; Path=${siteConfiguration.sessionCookiePath}; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  );
  assertEquals(sessionResponse.user_id, user.id.toString());
});
