import ISubscriber, { AcceptedEvent } from "@domain/event/subscriber.ts";
import ReportStatusChange from "@domain/report/events/report-status-change.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import IEmailTransporter, { IEmailEnvelope } from "../transporter/mod.ts";
import Template from "../templates/template.ts";
import Status from "@domain/report/status.ts";
import { Contact } from "../transporter/contact.ts";

export default class ReportStatusChangeNotification implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [ReportStatusChange];

  constructor(
    private readonly siteConfiguration: SiteConfiguration,
    private readonly emailTransporter: IEmailTransporter,
  ) {
  }

  async notify(event: ReportStatusChange): Promise<boolean> {
    await Promise.resolve();

    // Skipping if the new status was set back to NEW
    if (event.newStatus.value === Status.New.value) {
      return true;
    }

    // Skipping if the user changing the status is also the author of the report
    if (event.actor.id.toString() === event.authorId.toString()) {
      return true;
    }

    const reportUrl = this.siteConfiguration.report(event.reportId);

    const template = new Template(
      "status-change",
      {
        title: event.reportTitle,
        username: event.username,
        url: reportUrl,
        newStatus: event.newStatus.toLocale(),
        oldStatus: event.newStatus.toLocale(),
      },
    );

    const envelope: IEmailEnvelope = {
      to: new Contact(event.email),
      from: this.siteConfiguration.mailSender,
      subject: "Der Status deiner Meldung hat sich geändert!",
      text: await template.getText(),
      html: await template.getHtml(),
    };

    await this.emailTransporter.send(envelope);

    return true;
  }
}
