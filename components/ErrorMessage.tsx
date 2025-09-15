import { ErrorResponse } from "../handler/errors.ts";
import Message from "./Message.tsx";

interface IErrorMessageProps {
  errorObj: unknown;
}

export default function ErrorMessage(props: IErrorMessageProps) {
  if (props.errorObj == null) {
    return null;
  }

  return <Message type="error">{getErrorMessage(props.errorObj)}</Message>;
}

function getErrorMessage(errorObj: unknown): string {
  const defaultErrorMessage = "Unbekannter Fehler";

  if (errorObj == null || typeof errorObj !== "object") {
    return defaultErrorMessage;
  }
  const errorCode = (errorObj as ErrorResponse).code;

  switch (errorCode) {
    case "InvalidCredentialsWithEmail":
    case "InvalidCredentialsWithUsername":
    case "SessionEmailNotVerified":
      return "Benutzername/E-Mail oder Passwort falsch!";

    case "UserEmailAlreadyExists":
      return "E-Mail Adresse bereits in Verwendung!";

    case "UserUsernameAlreadyExists":
      return "Benutzername bereits in Verwendung!";

    default:
      return defaultErrorMessage;
  }
}
