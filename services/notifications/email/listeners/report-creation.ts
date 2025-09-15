import ISubscriber, { AcceptedEvent } from "@domain/event/subscriber.ts";
import ReportCreation from "@domain/report/events/report-creation.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import IEmailTransporter, { IEmailEnvelope } from "../transporter/mod.ts";
import Role from "@domain/user/role.ts";
import Template from "../templates/template.ts";
import { Contact } from "../transporter/contact.ts";
import IUserRepository from "@domain/user/repository.ts";

export class ReportCreationNotification implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [ReportCreation];

  constructor(
    private readonly siteConfiguration: SiteConfiguration,
    private readonly transporter: IEmailTransporter,
    private readonly userRepository: IUserRepository,
  ) {}

  async notify(event: ReportCreation): Promise<boolean> {
    const recipients = new Set<string>();

    // Admins & Tutoren benachrichtigen (außer dem Kommentator)
    const rolesToNotify = [Role.Admin, Role.Tutor];
    const privilegedUsers = await this.userRepository.getByRoles(rolesToNotify);

    for (const user of privilegedUsers) {
      if (user.id.toString() === event.report.user.id.toString()) {
        continue;
      }
      recipients.add(user.email.toString());
    }

    if (recipients.size === 0) return true;

    const reportUrl = this.siteConfiguration.report(event.report.id);

    const template = new Template("report-event", {
      title: event.report.title,
      eventTitle: "Neue Meldung",
      url: reportUrl,
    });

    const envelopeBase = {
      from: this.siteConfiguration.mailSender,
      subject: "Neuer Kommentar zu einer Meldung",
      text: await template.getText(),
      html: await template.getHtml(),
    };

    for (const email of recipients) {
      const envelope: IEmailEnvelope = {
        ...envelopeBase,
        to: new Contact(email),
      };

      await this.transporter.send(envelope);
    }

    return true;
  }
}
