import ISubscriber, { AcceptedEvent } from "../event/subscriber.ts";
import ReportCreation from "../report/events/report-creation.ts";
import ReportStatusChange from "../report/events/report-status-change.ts";
import ReportUpdate from "../report/events/report-update.ts";
import { ReportLifecycleEventType } from "./report-lifecycle-event.ts";
import ReportLifecycleService from "./service.ts";

export default class ReportLifecycleListener implements ISubscriber {
  acceptedEvents: AcceptedEvent[] = [
    ReportCreation,
    ReportUpdate,
    ReportStatusChange,
  ];

  constructor(private readonly service: ReportLifecycleService) {}

  async notify(
    event: ReportCreation | ReportUpdate | ReportStatusChange,
  ): Promise<boolean> {
    switch (event.constructor.name) {
      case "ReportCreation": {
        const creationEvent = event as ReportCreation;
        await this.service.save(
          creationEvent.report,
          creationEvent.report.user,
          ReportLifecycleEventType.Creation,
          {},
          creationEvent.report.toPrimitive(),
        );
        return true;
      }

      case "ReportUpdate": {
        const updateEvent = event as ReportUpdate;
        await this.service.save(
          updateEvent.report,
          updateEvent.actor,
          ReportLifecycleEventType.Update,
          updateEvent.oldReportDiff,
          updateEvent.newReportDiff,
        );
        return true;
      }

      case "ReportStatusChange": {
        const statusChangeEvent = event as ReportStatusChange;
        await this.service.save(
          statusChangeEvent.report,
          statusChangeEvent.actor,
          ReportLifecycleEventType.StatusChange,
          { status: statusChangeEvent.oldStatus.value },
          { status: statusChangeEvent.newStatus.value },
        );
        return true;
      }
    }

    throw new Error(`unexpected event '${event.constructor.name}'`);
  }
}
