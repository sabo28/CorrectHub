import ISessionService from "@domain/session/service.ts";
import Session from "@domain/session/session.ts";
import { requestDataToObject } from "@utils/requestDataToObject.ts";
import { deleteCookie, getCookies } from "$std/http/cookie.ts";
import z from "zod/v4";
import { Option } from "@utils/option.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { BadRequest } from "./errors.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";

const SessionInput = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const SessionResponse = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.number(),
  expires_at: z.number(),
  updated_at: z.number(),
});

type SessionResponse = z.infer<typeof SessionResponse>;

export default class SessionHandler {
  constructor(private readonly sessionService: ISessionService) {}

  async login(request: Request): Promise<SessionResponse> {
    const maybeData = await requestDataToObject(request);
    if (maybeData.isErr()) {
      throw maybeData.unwrapErr();
    }

    const { identifier, password } = SessionInput.parse(maybeData.unwrap());

    const session = await this.sessionService.login(identifier, password);

    return this.toSessionResponse(session);
  }

  async logout(
    request: Request,
    siteConfiguration: SiteConfiguration,
  ): Promise<[Response, SessionResponse]> {
    const cookies = getCookies(request.headers);
    const sessionCookie = Option.from(
      cookies[siteConfiguration.sessionCookieName],
    );

    if (sessionCookie.isNone()) {
      throw new BadRequest("invalid session cookie");
    }

    const sessionId = new Uuid(sessionCookie.unwrap());
    const session = await this.sessionService.logout(sessionId);

    const headers = new Headers();
    deleteCookie(
      headers,
      siteConfiguration.sessionCookieName,
      { path: siteConfiguration.sessionCookiePath },
    );

    return [
      new Response(null, {
        headers,
      }),
      this.toSessionResponse(session),
    ];
  }

  private toSessionResponse(session: Session): SessionResponse {
    return {
      id: session.id.toString(),
      user_id: session.userId.toString(),
      created_at: session.createdAt.toUnix(),
      expires_at: session.expiresAt.toUnix(),
      updated_at: session.updatedAt.toUnix(),
    };
  }
}
