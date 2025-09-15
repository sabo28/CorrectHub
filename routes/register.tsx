import { RouteConfig } from "$fresh/server.ts";
import RegisterForm from "../islands/RegisterForm.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default function RegisterPage() {
  return (
    <div class="min-h-screen flex bg-gray-100">
      <div class="w-full md:w-2/6 bg-white flex flex-col p-12 shadow-md">
        <img src="/logo.svg" alt="Logo" class="w-48 mb-12 self-center" />
        <div class="flex-grow flex items-center">
          <div class="w-full">
            <h1 class="text-2xl font-bold mb-4">Registrierung</h1>
            <RegisterForm />
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-4/6">
        <img
          src="/images/register-bg.jpg"
          alt="Buecher"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
