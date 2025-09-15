import { ComponentChildren } from "preact";
import RelativeDate from "../components/RelativeDate.tsx";
import StatusBadge from "../components/StatusBadge.tsx";
import DiffTable from "../components/DiffTable.tsx";
import {
  IPrimitiveReportLifecycleEvent,
  ReportLifecycleEventType,
} from "@domain/report-lifecycle/report-lifecycle-event.ts";
import { StatusName } from "@domain/report/status.ts";
import Priority from "@domain/report/priority.ts";

export interface IReportStateFlat {
  id: string;
  reportId: string;
  actorName: string;
  type: ReportLifecycleEventType;
  oldValues: Record<string, string | number | boolean | string[]>;
  newValues: Record<string, string | number | boolean | string[]>;
  createdAt: number;
}

interface IReportEventProps {
  anonymousUserId?: string;
  event: IPrimitiveReportLifecycleEvent;
}

const FieldNames = {
  title: "Titel",
  description: "Beschreibung",
  priority: "Priorität",
  assigneeUsername: "Zugewiesen",
  links: "Links",
};

const customRenderers = {
  priority: (value: string | number | boolean | string[]) => {
    return new Priority(+value).toLocale();
  },
  links: (links: string | number | boolean | string[]) => {
    if (!Array.isArray(links) || !links.length) {
      return null;
    }

    return (
      <ul>
        {links.map((value, index) => <li key={index}>{value}</li>)}
      </ul>
    );
  },
};

export default function ReportEventItem(props: IReportEventProps) {
  const event = props.event;
  return (
    <details class="mb-1 text-sm bg-white hover:bg-gray-50 border border-white hover:border-gray-100 open:bg-white open:border-gray-100 rounded transition-colors">
      <summary class="flex cursor-pointer p-2">
        <div class="inline-block self-start">
          {getEventSummary(event)}
          <br />
          <RelativeDate
            class=" text-gray-500"
            unixMillis={event.createdAtMillis}
          />
        </div>
      </summary>

      <div class="overflow-auto p-2">
        {getEventDetails(event)}
      </div>
    </details>
  );
}

function getEventSummary(
  event: IPrimitiveReportLifecycleEvent,
): ComponentChildren {
  switch (event.type) {
    case "CREATION":
      return (
        <>
          <strong>{event.actorName}</strong> hat diese Meldung erstellt
        </>
      );
    case "UPDATE":
      return (
        <>
          <strong>{event.actorName}</strong> hat diese Meldung bearbeitet
        </>
      );
    case "STATUS_CHANGE":
      return (
        <>
          <strong>{event.actorName}</strong> hat den Status auf{" "}
          <StatusBadge value={event.newValues.status ?? StatusName.UNKNOWN} />
          {" "}
          geändert
        </>
      );
    default:
      return "Unbekanntes Event";
  }
}

function getEventDetails(
  event: IPrimitiveReportLifecycleEvent,
): ComponentChildren {
  switch (event.type) {
    case "CREATION":
      return <DiffTable names={FieldNames} right={event.newValues} />;
    case "UPDATE":
      return (
        <DiffTable
          names={FieldNames}
          customRenderers={customRenderers}
          left={event.oldValues}
          right={event.newValues}
        />
      );
    case "STATUS_CHANGE":
      return (
        <>
          <StatusBadge value={event.oldValues.status ?? StatusName.UNKNOWN} />
          {" → "}
          <StatusBadge value={event.newValues.status ?? StatusName.UNKNOWN} />
        </>
      );
    default:
      return "Unbekanntes Event";
  }
}
