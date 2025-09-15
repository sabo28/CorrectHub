import { FreshContext } from "$fresh/server.ts";
import Application, { IApplication } from "@handler/application.ts";
import createDatabaseClientWithMigration from "../persistence/db.ts";
import { setCookie } from "$std/http/cookie.ts";

const skipRoutes = [
  "/styles.css",
  "/logo.svg",
  "/images/",
  "/_fresh",
  "/_frsh/",
  "/api/",
];

export async function handler(
  req: Request,
  ctx: FreshContext<IApplication>,
) {
  if (skipRoutes.find((r) => ctx.route.startsWith(r))) {
    return ctx.next();
  }

  const db = await createDatabaseClientWithMigration();
  const application = new Application(req, db);
  await application.init();
  ctx.state = application;

  switch (ctx.route) {
    // For the following routes, a user session is not required and is
    // redirected.
    case "/forgot-password":
    case "/reset-password":
    case "/register":
    case "/login":
    case "/verify": {
      const redirect = redirectResponseOnActiveSession(ctx.state.loggedIn);
      if (redirect) {
        return redirect;
      }
      break;
    }

    // For all other routes, a user session is required. If none is present,
    // a redirect to the login page is made.
    default: {
      const redirect = redirectResponseOnInactiveSession(ctx.state.loggedIn);
      if (redirect) {
        return redirect;
      }
    }
  }

  const resp = await ctx.next();

  if (ctx.state.loggedIn) {
    const session = ctx.state.extendedSession.unwrap();
    const expiresAt = 30 * 60; // 30 minutes in seconds;
    const secure = new URL(req.url).protocol === "https";

    setCookie(resp.headers, {
      name: ctx.state.siteConfiguration.sessionCookieName,
      value: session.id.toString(),
      maxAge: expiresAt,
      sameSite: "Lax",
      path: ctx.state.siteConfiguration.sessionCookiePath,
      secure,
      httpOnly: !secure,
    });
  }
  return resp;
}

function redirectResponseOnActiveSession(loggedIn: boolean) {
  if (!loggedIn) {
    return;
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
    },
  });
}

function redirectResponseOnInactiveSession(loggedIn: boolean) {
  if (loggedIn) {
    return;
  }

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/login",
    },
  });
}
