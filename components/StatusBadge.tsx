import Status, { StatusName } from "@domain/report/status.ts";

interface IStatusProps {
  size?: "xs" | "sm" | "base" | "lg";
  value: StatusName;
}

export const STATUS_COLOR_MAP: Record<string, string> = {
  NEW: "text-white bg-gray-400 border-gray-500",
  REJECTED: "text-white bg-red-400 border-red-500",
  IN_PROGRESS: "text-white bg-blue-400 border-blue-500",
  IN_REVIEW: "text-white bg-teal-500 border-teal-600",
  RESOLVED: "text-white bg-lime-500 border-lime-600",
  unknown: "text-white bg-gray-400 border-gray-500",
};

export default function StatusBadge(props: IStatusProps) {
  const size = props.size ?? "xs";
  const colors = STATUS_COLOR_MAP[props.value ?? "unknown"] ??
    STATUS_COLOR_MAP.unknown;

  return (
    <span
      class={`inline-block cursor-default text-center text-${size} border rounded px-2 py-1 ${colors}`}
    >
      {new Status(props.value).toLocale()}
    </span>
  );
}
