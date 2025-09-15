import { PageProps } from "$fresh/server.ts";
import HeaderBar from "../islands/HeaderBar.tsx";
import FooterBar from "../components/FooterBar.tsx";
import { IApplication } from "@handler/application.ts";

export default function Layout(props: PageProps<unknown, IApplication>) {
  const { Component } = props;
  let canViewUsers = false;
  if (props.state.currentUser?.isSome()) {
    const user = props.state.currentUser.unwrap();
    canViewUsers = user.permissions.canViewUsers();
  }

  return (
    <div class="flex flex-col min-h-screen bg-gray-100">
      <HeaderBar canViewUsers={canViewUsers} />

      <div class="flex-grow">
        <main
          class={` bg-white p-10 rounded-xl shadow-md w-full ${
            ["/", "/users"].includes(props.route) ? "max-w-6xl" : "max-w-2xl"
          } mx-auto border border-gray-300 mt-6`}
        >
          <Component />
        </main>
      </div>

      <FooterBar />
    </div>
  );
}
