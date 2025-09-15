import { ComponentChildren } from "preact";

interface MessageProps {
  type?: "neutral" | "success" | "info" | "warning" | "error";
  border?: boolean;
  class?: string;
  children?: ComponentChildren | string;
}

const classes: Record<string, {
  box: string;
  text: string;
}> = {
  neutral: { box: "border-gray-200 bg-gray-50", text: "text-gray-700" },
  success: { box: "border-green-200 bg-green-50", text: "text-green-900" },
  info: { box: "border-teal-200 bg-teal-50", text: "text-teal-700" },
  warning: { box: "border-yellow-200 bg-yellow-50", text: "text-yellow-700" },
  error: { box: "border-red-200 bg-red-50", text: "text-red-700" },
};

export default function Message(props: MessageProps) {
  const messageType = props.type ?? "neutral";
  const border = props.border ?? true;

  return (
    <div
      class={`${props.class ? props.class + " " : ""}rounded ${
        border ? "border" : ""
      } p-4 ${classes[messageType].box}`}
    >
      <div class={"text-sm " + classes[messageType].text}>
        {props.children}
      </div>
    </div>
  );
}
