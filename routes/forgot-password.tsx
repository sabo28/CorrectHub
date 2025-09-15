import { RouteConfig } from "$fresh/server.ts";
import ForgotPasswordForm from "../islands/ForgotPasswordForm.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function ForgotPasswordPage() {
  return (
    <div class="min-h-screen flex bg-gray-100">
      <div class="w-full md:w-2/6 bg-white flex flex-col p-12 shadow-md">
        <img
          src="/logo.svg"
          alt="Logo"
          class="w-48 mb-12 self-center"
        />
        <div class="flex-grow flex items-center">
          <div class="w-full">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-4/6">
        <img
          src="/images/forgot-bg.jpg"
          alt="Buecherrei"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
