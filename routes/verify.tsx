import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { IApplication } from "@handler/application.ts";
import { Result } from "@utils/result.ts";
import { InvalidVerificationCode } from "@domain/user/error.ts";
import Message from "../components/Message.tsx";
import { Button } from "../islands/Button.tsx";

export const config: RouteConfig = {
  skipInheritedLayouts: true,
};

export default async function VerifyPage(
  req: Request,
  ctx: RouteContext<unknown, IApplication>,
) {
  const params = new URL(req.url).searchParams;
  const code = params.get("c");

  if (!code) {
    throw new InvalidVerificationCode();
  }

  const result = await Result.from(ctx.state.userService.verify(code));

  if (result.isErr()) {
    throw result.unwrapErr();
  }

  return (
    <div class="min-h-screen flex bg-gray-100">
      <div class="w-full md:w-2/6 bg-white flex flex-col p-12 shadow-md">
        <img src="/logo.svg" alt="Logo" class="w-48 mb-12 self-center" />
        <div class="flex-grow flex items-center">
          <div class="w-full">
            <h1 class="text-2xl font-bold mb-4">
              E-Mail Verifikation
            </h1>

            <Message type="success">
              E-Mail wurde erfolgreich verifiziert
            </Message>

            <div class="flex justify-end mt-6">
              <Button class="flex-1" href="/login">zum Login</Button>
            </div>
          </div>
        </div>
      </div>
      <div class="hidden md:block md:w-4/6">
        <img
          src="/images/login-bg.jpg"
          alt="Buecherregal"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
