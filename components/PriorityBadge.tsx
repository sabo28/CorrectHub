import Priority, { priorityLocalMap } from "@domain/report/priority.ts";

interface IPriorityBadgeProps {
  value: number;
}

const colorMap: Record<typeof priorityLocalMap[number], string> = {
  10: "bg-green-100 text-green-800",
  20: "bg-yellow-100 text-yellow-800",
  30: "bg-orange-100 text-orange-800",
  40: "bg-red-100 text-red-800",
};

export default function PriorityBadge(props: IPriorityBadgeProps) {
  return (
    <span
      class={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
        colorMap[props.value]
      }`}
    >
      {new Priority(props.value).toLocale()}
    </span>
  );
}
