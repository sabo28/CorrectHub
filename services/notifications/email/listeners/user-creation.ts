import ISubscriber, { AcceptedEvent } from "@domain/event/subscriber.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import UserCreationEvent from "@domain/user/events/creation.ts";
import IEmailTransporter, { IEmailEnvelope } from "../transporter/mod.ts";
import { Contact } from "../transporter/contact.ts";
import Template from "../templates/template.ts";

export class UserCreationNotification implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [UserCreationEvent];

  constructor(
    private readonly siteConfiguration: SiteConfiguration,
    private readonly transporter: IEmailTransporter,
  ) {
  }

  async notify(event: UserCreationEvent): Promise<boolean> {
    const verificationUrl = this.siteConfiguration.verify(
      event.verificationCode,
    );

    const template = new Template(
      "verification",
      {
        username: event.username,
        verificationUrl: verificationUrl.toString(),
        verificationCode: event.verificationCode.toString(),
      },
    );

    const envelope: IEmailEnvelope = {
      to: new Contact(event.email),
      from: this.siteConfiguration.mailSender,
      subject: "Bitte verifiziere Deine E-Mail Adresse",
      text: await template.getText(),
      html: await template.getHtml(),
    };

    await this.transporter.send(envelope);

    return true;
  }
}
