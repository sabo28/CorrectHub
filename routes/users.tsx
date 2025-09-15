import { Head } from "$fresh/runtime.ts";
import UserTable from "../islands/UserTable.tsx";
import Headline from "../components/Headline.tsx";
import User, { IPrimitiveUser } from "@domain/user/user.ts";
import { Handlers, RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import { Unauthorized } from "@handler/errors.ts";

interface IUserPageProps {
  users: IPrimitiveUser[];
  orderBy: keyof User;
  direction: boolean;
}

export const handler: Handlers<unknown, IApplication> = {
  async GET(_req, ctx) {
    if (!ctx.state.loggedIn) {
      throw new Unauthorized();
    }

    const hasPermission = ctx.state.currentUser.unwrap().permissions
      .canViewUsers();
    if (!hasPermission) {
      throw new Unauthorized();
    }

    const orderBy = ctx.url.searchParams.get("orderBy") ?? "createdAt";
    const directionQuery = ctx.url.searchParams.get("direction") ?? "asc";
    const direction = directionQuery === "desc" ? false : true;

    const users = (await ctx.state.userService.list(orderBy, direction))
      .map((
        user,
      ) => user.toPrimitive());

    return ctx.render({ users, orderBy, direction });
  },
};

export default function UsersPage(
  props: RouteContext<IUserPageProps, IApplication>,
) {
  const { users, orderBy, direction } = props.data;
  return (
    <>
      <Head>
        <title>Benutzerverwaltung</title>
      </Head>
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-center items-center mb-8">
          <Headline>Benutzerübersicht</Headline>
        </div>

        <UserTable
          currentUser={props.state.currentUser.unwrap().id.toString()}
          canChangeRole={props.state.currentUser.unwrap().permissions
            .canChangeUserRole()}
          users={users}
          orderBy={User.fieldToPrimitiveMap(orderBy) ?? "createdAtMillis"}
          direction={direction}
        />
      </div>
    </>
  );
}
