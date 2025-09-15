import { PageProps, RouteConfig } from "$fresh/server.ts";
import ChangePasswordForm from "../islands/ChangePasswordForm.tsx";
import Uuid from "@domain/value-objects/uuid.ts";
import { InvalidResetPasswordToken } from "@domain/user/error.ts";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function ResetPasswordPage(props: PageProps) {
  const url = new URL(props.url);
  const tokenParam = url.searchParams.get("t");

  if (!tokenParam) {
    throw new InvalidResetPasswordToken();
  }

  const token = new Uuid(tokenParam);

  return (
    <div class="min-h-screen flex bg-gray-100">
      <div class="w-full md:w-2/6 bg-white flex flex-col p-12 shadow-md">
        <img src="/logo.svg" alt="Logo" class="w-48 mb-12 self-center" />
        <div class="flex-grow flex items-center">
          <div class="w-full">
            <h1 class="text-2xl font-bold mb-4">Neues Passwort setzen</h1>
            <ChangePasswordForm token={token.toString()} />
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-4/6">
        <img
          src="/images/login-bg.jpg"
          alt="Bücherregal"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
