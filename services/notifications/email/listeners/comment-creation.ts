import ISubscriber, { AcceptedEvent } from "@domain/event/subscriber.ts";
import CommentCreationEvent from "@domain/comment/events/comment-creation.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import IEmailTransporter, { IEmailEnvelope } from "../transporter/mod.ts";
import { Contact } from "../transporter/contact.ts";
import Template from "../templates/template.ts";
import IUserRepository from "@domain/user/repository.ts";
import Role from "@domain/user/role.ts";

export class CommentCreationNotification implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [CommentCreationEvent];

  constructor(
    private readonly siteConfiguration: SiteConfiguration,
    private readonly transporter: IEmailTransporter,
    private readonly userRepository: IUserRepository,
  ) {}

  async notify(event: CommentCreationEvent): Promise<boolean> {
    const recipients = new Set<string>();

    // Report-Autor nur benachrichtigen, wenn er NICHT selbst kommentiert hat
    if (event.commentAuthorId.toString() !== event.reportAuthorId.toString()) {
      recipients.add(event.reportAuthorEmail.toString());
    }

    // Admins & Tutoren benachrichtigen (außer dem Kommentator)
    const rolesToNotify = [Role.Admin, Role.Tutor];
    const privilegedUsers = await this.userRepository.getByRoles(rolesToNotify);

    for (const user of privilegedUsers) {
      if (user.id.toString() === event.commentAuthorId.toString()) {
        continue;
      }
      recipients.add(user.email.toString());
    }

    if (recipients.size === 0) return true;

    const reportUrl = this.siteConfiguration.report(event.reportId);

    const template = new Template("comment-creation", {
      title: event.reportTitle,
      commentText: event.commentText,
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
