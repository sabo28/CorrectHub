import {
  EmailAlreadyExists,
  UsernameAlreadyExists,
} from "@domain/user/error.ts";
import { None, Option, Some } from "@utils/option.ts";
import { z } from "zod/v4";
import {
  EmailNotVerified,
  InvalidCredentialsWithEmail,
  InvalidCredentialsWithUsername,
} from "@domain/session/error.ts";

export class BadRequest extends Error {}

export class Unauthorized extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorized");
  }
}

export class Conflict extends Error {}

export class UnsupportedMediaType extends Error {
  constructor(mime: string) {
    if (!mime) {
      throw new Error("invalid mime type");
    }

    super(`unsupported Content-Type '${mime}'`);
  }
}

export interface ErrorResponse {
  statusCode: number;
  type: string;
  code: string;
  message: string;
}

export function errorResponseHandler(error: Error): ErrorResponse {
  const code: Option<string> = error.name === "Error"
    ? None()
    : Some(error.name);

  if (error instanceof z.ZodError) {
    return zodErrorResponseHandler(error);
  }

  switch (error.constructor) {
    case BadRequest:
      return {
        statusCode: 400,
        type: "BadRequest",
        code: code.unwrapOr("BadRequest"),
        message: error.message,
      };

    case Unauthorized:
    case InvalidCredentialsWithEmail:
    case InvalidCredentialsWithUsername:
      return {
        statusCode: 401,
        type: "Unauthorized",
        code: code.unwrapOr("Unauthorized"),
        message: error.message,
      };

    case EmailNotVerified:
      return {
        statusCode: 403,
        type: "Forbidden",
        code: code.unwrapOr("Forbidden"),
        message: error.message,
      };

    case UsernameAlreadyExists:
    case EmailAlreadyExists:
    case Conflict:
      return {
        statusCode: 409,
        type: "Conflict",
        code: code.unwrapOr("Conflict"),
        message: error.message,
      };

    case UnsupportedMediaType:
      return {
        statusCode: 415,
        type: "UnsupportedMediaType",
        code: code.unwrapOr("UnsupportedMediaType"),
        message: error.message,
      };

    default:
      return {
        statusCode: 500,
        type: "Unknown",
        code: "Unknown",
        message: "unknown error",
      };
  }
}

function zodErrorResponseHandler(error: z.ZodError): ErrorResponse {
  return {
    statusCode: 400,
    type: "BadRequest",
    code: "InvalidInput",
    message: z.prettifyError(error),
  };
}
