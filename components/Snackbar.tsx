import { useEffect, useState } from "preact/hooks";
import { ComponentChildren } from "preact";
import { Button } from "../islands/Button.tsx";

interface SnackbarProps {
  type?: "neutral" | "success" | "info" | "warning" | "error";
  class?: string;
  children: ComponentChildren;
  duration?: number;
  onClose?: () => void;
}

const classes: Record<string, { box: string; text: string }> = {
  neutral: { box: "bg-gray-50 border-gray-200", text: "text-gray-700" },
  success: { box: "bg-green-50 border-green-200", text: "text-green-900" },
  info: { box: "bg-teal-50 border-teal-200", text: "text-teal-700" },
  warning: { box: "bg-yellow-50 border-yellow-200", text: "text-yellow-700" },
  error: { box: "bg-red-50 border-red-200", text: "text-red-700" },
};

export default function Snackbar({
  type = "neutral",
  duration = 4000,
  children,
  onClose,
  class: customClass = "",
}: SnackbarProps) {
  const [visible, setVisible] = useState(true);
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    const enterTimer = setTimeout(() => setEntering(false), 300);
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => {
      clearTimeout(timer);
      clearTimeout(enterTimer);
    };
  }, [duration]);

  useEffect(() => {
    setVisible(true);
  }, [children]);

  if (!visible) return null;

  return (
    <div
      class={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300
      ${entering ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`}
    >
      <div
        class={`border rounded-md shadow-lg px-4 py-3 flex items-center gap-3 max-w-sm w-full 
    ${classes[type].box} ${classes[type].text} ${customClass}`}
      >
        <div class="text-sm flex-1 leading-snug">
          <div class="whitespace-pre-line">{children}</div>
        </div>
        <Button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          variant="icon"
          aria-label="Schließen"
        >
          ×
        </Button>
      </div>
    </div>
  );
}
