import { PageProps, RouteConfig } from "$fresh/server.ts";
import LoginForm from "../islands/LoginForm.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function LoginPage(props: PageProps) {
  const url = new URL(props.url);
  const showMessage = url.searchParams.get("m");

  return (
    <div class="min-h-screen flex bg-gray-100">
      <div class="w-full lg:w-2/5 min-w-[320px] bg-white flex flex-col p-8 lg:p-12 shadow-md">
        <img src="/logo.svg" alt="Logo" class="w-48 mb-12 self-center" />
        <div class="flex-grow flex items-center">
          <div class="w-full">
            <h1 class="text-2xl font-bold mb-4">Login</h1>
            <LoginForm showMessage={showMessage} />
          </div>
        </div>
      </div>
      <div class="hidden lg:flex flex-1">
        <img
          src="/images/login-bg.jpg"
          alt="Buecherregal"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
