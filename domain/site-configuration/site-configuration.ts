import { Contact } from "@services/notifications/email/transporter/contact.ts";
import Uuid from "../value-objects/uuid.ts";
import VerificationCode from "../user/verification-code.ts";

export default class SiteConfiguration {
  constructor(
    readonly baseUrl: URL,
    readonly mailTransporter?: "MAILPIT" | "SENDGRID",
    readonly mailSender = new Contact(
      "no-reply@iu.flk.onl",
      "CorrectHub",
    ),
    readonly sessionCookieName = "sessionId",
    readonly sessionCookiePath = "/",
  ) {}

  url(pathname: string): string {
    return new URL(`${this.baseUrl}${pathname}`).toString();
  }

  verify(verificationCode: VerificationCode): string {
    return this.url(`verify?c=${verificationCode.toString()}`);
  }

  resetPassword(resetToken: Uuid): string {
    return this.url(`reset-password?t=${resetToken.toString()}`);
  }

  report(reportId: Uuid): string {
    return this.url(`report/${reportId.toString()}`);
  }
}
