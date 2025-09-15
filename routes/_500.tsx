import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { InvalidVerificationCode } from "@domain/user/error.ts";
import Headline from "../components/Headline.tsx";
import { BadRequest, Conflict, Unauthorized } from "@handler/errors.ts";
import { NoPermissionToCreateComment } from "@domain/comment/error.ts";
import {
  NoPermissionToUpdateField,
  NoPermissionToUpdateReport,
  NoPermissionToUpdateStatus,
} from "@domain/report/error.ts";

interface IError {
  title: string;
  description: string;
}

export default function Error500Page(props: PageProps) {
  const { title, description } = getError(props.error);
  return (
    <>
      <Head>
        <title>Fehler - {title}</title>
      </Head>

      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <Headline>{title}</Headline>

        <p class="my-4">
          {description}
        </p>
      </div>
    </>
  );
}

function getError(err: unknown): IError {
  const defaultError = {
    title: "Unbekannter Fehler",
    description: "Ein unbekannter Fehler ist aufgetreten",
  };

  if (err == null || typeof err !== "object") {
    return defaultError;
  }

  const error = err as Error;
  switch (error.constructor) {
    case BadRequest:
      return {
        title: "Fehlerhafte Anfrage",
        description: error.message,
      };

    case InvalidVerificationCode:
      return {
        title: "E-Mail Verifikation fehlgeschlagen",
        description: "Verifikations-Code ist ungültig",
      };

    case Unauthorized:
    case NoPermissionToCreateComment:
    case NoPermissionToUpdateField:
    case NoPermissionToUpdateReport:
    case NoPermissionToUpdateStatus:
      return {
        title: "Kein Zugriff",
        description: "Du hast auf diese Seite keinen Zugriff",
      };

    case Conflict:
      return {
        title: "Konflikt",
        description: "Diese Entität existiert bereits",
      };

    default:
      return defaultError;
  }
}
