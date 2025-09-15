import ISubscriber, { AcceptedEvent } from "@domain/event/subscriber.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import PasswordResetRequestedEvent from "@domain/password-reset-token/events/passwordResetRequestedEvent.ts";
import IEmailTransporter, { IEmailEnvelope } from "../transporter/mod.ts";
import { Contact } from "../transporter/contact.ts";
import Template from "../templates/template.ts";

export class PasswordResetNotification implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [PasswordResetRequestedEvent];

  constructor(
    private readonly siteConfiguration: SiteConfiguration,
    private readonly transporter: IEmailTransporter,
  ) {}

  async notify(event: PasswordResetRequestedEvent): Promise<boolean> {
    const resetUrl = this.siteConfiguration.resetPassword(event.resetToken);

    const template = new Template("reset-password", {
      resetUrl: resetUrl.toString(),
      token: event.resetToken.toString(),
    });

    const envelope: IEmailEnvelope = {
      to: new Contact(event.email),
      from: this.siteConfiguration.mailSender,
      subject: "Passwort zurücksetzen",
      text: await template.getText(),
      html: await template.getHtml(),
    };

    await this.transporter.send(envelope);

    return true;
  }
}
