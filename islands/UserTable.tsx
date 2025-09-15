import User, { IPrimitiveUser } from "@domain/user/user.ts";
import RelativeDate from "../components/RelativeDate.tsx";
import { Button } from "./Button.tsx";
import Table from "./Table.tsx";

interface IUserTableProps {
  currentUser: string;
  canChangeRole: boolean;
  users: IPrimitiveUser[];
  orderBy: keyof IPrimitiveUser;
  direction: boolean;
  query?: string;
}

export default function UserTable(props: IUserTableProps) {
  const sortBy = props.orderBy as keyof IPrimitiveUser;
  const sortOrder = props.direction ? "asc" : "desc";

  const handleSort = (
    orderBy: keyof IPrimitiveUser,
    sortOrder: "asc" | "desc",
  ) => {
    const url = new URL(location.href);
    url.searchParams.set(
      "orderBy",
      User.primitiveToFieldMap(orderBy) ?? "createdAt",
    );
    url.searchParams.set("direction", sortOrder);

    location.replace(url);
  };

  const updateRole = (userId: string, newRole: string) => {
    if (!props.canChangeRole) {
      return () => {
        alert("Du hast leider keine Berechtigung, diese Rolle zu ändern");
      };
    }

    return async () => {
      if (userId === props.currentUser && newRole !== "ADMIN") {
        const reallyOk = confirm(
          "ACHTUNG! Damit verlierst du die Möglichkeit, Rollen zu ändern!",
        );
        if (!reallyOk) {
          return;
        }
      }

      const req = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          new_role: newRole,
        }),
      });

      const body = await req.json();
      if (!req.ok) {
        console.error(body);
        const message = body?.code === "Unauthorized"
          ? "Hoppla, du bist nicht berechtigt die Rolle zu ändern"
          : "Hoppla, das hat nicht geklappt";

        alert(message);
      }

      location.reload();
    };
  };

  return (
    <div class="w-full p-4">
      <div class="grid gap-4 [@media(min-width:756px)]:hidden">
        {props.users.length === 0 && (
          <div class="text-center text-gray-500">Keine Benutzer gefunden.</div>
        )}
        {props.users.map((row) => (
          <div class="p-4 border rounded-md bg-white shadow">
            <div class="font-semibold text-base text-gray-800 mb-1">
              {row.username}
            </div>
            <div class="text-sm text-gray-700">
              <strong>E-Mail:</strong> {row.email}
            </div>
            <div class="text-sm text-gray-700">
              <strong>Registriert am:</strong>{" "}
              <RelativeDate unixMillis={row.createdAtMillis} />
            </div>
            <div class="text-sm text-gray-700 mt-2">
              <strong>Rolle:</strong>
              <div class="flex gap-2 mt-1 flex-wrap">
                <Button
                  variant={row.role === "MEMBER" ? "primary" : "regular"}
                  onClick={updateRole(row.id, "MEMBER")}
                >
                  Member
                </Button>
                <Button
                  variant={row.role === "TUTOR" ? "primary" : "regular"}
                  onClick={updateRole(row.id, "TUTOR")}
                >
                  Tutor
                </Button>
                <Button
                  variant={row.role === "ADMIN" ? "primary" : "regular"}
                  onClick={updateRole(row.id, "ADMIN")}
                >
                  Admin
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div class="hidden [@media(min-width:756px)]:block">
        <Table
          rows={props.users}
          rowId="id"
          emptyMessage="Keine Benutzer gefunden."
          onSort={handleSort}
          orderBy={sortBy}
          sortOrder={sortOrder}
          columns={{
            username: {
              label: "Benutzername",
              center: true,
              renderer(row) {
                return <strong>{row.username}</strong>;
              },
            },
            email: {
              label: "E-Mail",
            },
            createdAtMillis: {
              label: "Registriert am",
              center: true,
              renderer(row) {
                return <RelativeDate unixMillis={row.createdAtMillis} />;
              },
            },
            role: {
              label: "Rolle",
              center: true,
              renderer(row) {
                return (
                  <>
                    <Button
                      variant={row.role === "MEMBER" ? "primary" : "regular"}
                      class="m-1"
                      onClick={updateRole(row.id, "MEMBER")}
                    >
                      Member
                    </Button>
                    <Button
                      variant={row.role === "TUTOR" ? "primary" : "regular"}
                      class="m-1"
                      onClick={updateRole(row.id, "TUTOR")}
                    >
                      Tutor
                    </Button>
                    <Button
                      variant={row.role === "ADMIN" ? "primary" : "regular"}
                      class="m-1"
                      onClick={updateRole(row.id, "ADMIN")}
                    >
                      Admin
                    </Button>
                  </>
                );
              },
            },
          }}
        />
      </div>
    </div>
  );
}
