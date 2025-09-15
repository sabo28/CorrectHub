import { useState } from "preact/hooks";
import { JSX } from "preact";
import Status, { StatusName } from "@domain/report/status.ts";

const baseClasses =
  `text-center text-white content-center font-bold py-2 px-4 text-base border-b-4 rounded transition-colors`;
const activeClasses =
  `bg-teal-500 hover:bg-teal-400 border-teal-700 hover:border-teal-500`;
const disabledClasses = `bg-teal-400 border-teal-600`;

const UPDATE_STATUS_URL = (reportId: string) =>
  `/report/${reportId}/edit/status`;

interface StatusDropdownProps {
  name?: string;
  value?: StatusName;
  disabled?: boolean;

  /**
   * When updateReportId is set, changing the status will also update the report.
   * However, when using this island within the ReportFrom, this field should not
   * be used and instead the value of the select field must be read.
   */
  updateReportId?: string;
}

export default function StatusDropdown(props: StatusDropdownProps) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(props.value ?? "NEW");

  function onChange(evt: JSX.TargetedEvent<HTMLSelectElement, Event>) {
    const oldValue = value;

    if (props.updateReportId != null) {
      const newValue = evt.currentTarget.value as StatusName;

      setLoading(true);
      setValue(newValue);

      updateStatus(props.updateReportId, newValue)
        .then((newStatus) => {
          setValue(newStatus);
          setLoading(false);
          location.reload();
        })
        .catch((reason) => {
          setValue(oldValue);
          setLoading(false);
          alert(reason);
        });
    }
  }

  // If the dropdown is disabled by default, then no need to render the select
  // at all
  if (props.disabled) {
    return (
      <span
        class={`${baseClasses} ${disabledClasses}`}
      >
        {getLabel(value as StatusName)}
      </span>
    );
  }

  const disabled = props.disabled || loading;
  const options = Object.values(StatusName).filter((status) =>
    status !== StatusName.UNKNOWN
  );
  return (
    <select
      onChange={onChange}
      name={props.name ?? "status"}
      value={value}
      disabled={disabled}
      class={`${baseClasses} ${disabled ? disabledClasses : activeClasses}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}

function getLabel(status: StatusName): string {
  const instance = new Status(status);
  return instance.toLocale();
}

async function updateStatus(
  reportId: string,
  status: StatusName,
): Promise<StatusName> {
  const response = await fetch(UPDATE_STATUS_URL(reportId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const body = await response.json();
  if (!response.ok) {
    // TODO: a new frontend service that can take in an Error and displays a temporary message
    console.error(body);
    alert("Hoppla! Etwas ist schiefgegangen!");
  }

  return body.status;
}
