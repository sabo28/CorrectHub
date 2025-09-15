import { JSX } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface IButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  class?: string;
  href?: string;
  variant?: "primary" | "regular" | "error" | "icon";
  btnSize?: "sm" | "md" | "lg";
}

const variantColors = {
  primary:
    "bg-teal-500 hover:bg-teal-400 text-white border-teal-700 hover:border-teal-500",
  regular:
    "bg-gray-500 hover:bg-gray-400 text-white border-gray-700 hover:border-gray-500",
  error:
    "bg-red-500 hover:bg-red-400 text-white border-red-700 hover:border-red-500",
  icon: "text-gray-500 hover:text-gray-700 bg-transparent border-none",
};

const btnSizeClasses = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-base",
  lg: "py-3 px-6 text-lg",
};

export function Spinner() {
  return (
    <svg
      class="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
  );
}

export function Button(props: IButtonProps) {
  const variant = props.variant ??
    (props.type === "submit" ? "primary" : "regular");
  const colorClasses = variantColors[variant];
  const additionalClasses = props.class ? props.class : "";
  const btnSize = props.btnSize ?? (variant === "icon" ? "sm" : "md");
  const btnSizeClass = btnSizeClasses[btnSize];

  const [loading, setLoading] = useState(false);

  const handleClick = async (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    if (loading || props.disabled) return;

    if (props.onClick) {
      e.preventDefault();
      setLoading(true);
      await props.onClick(e);
    }
  };

  if (props.href) {
    return (
      <a
        href={props.href}
        onClick={(e) => {
          if (!IS_BROWSER || loading || props.disabled) {
            e.preventDefault();
          } else {
            setLoading(true);
          }
        }}
        class={`${additionalClasses} ${btnSizeClass} ${colorClasses} relative flex justify-center items-center font-bold border-b-4 rounded transition-colors ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {loading && (
          <span class="absolute inset-0 flex justify-center items-center">
            <Spinner />
          </span>
        )}
        <span class={loading ? "opacity-0" : "opacity-100"}>
          {props.children}
        </span>
      </a>
    );
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={!IS_BROWSER || props.disabled || loading}
      class={`${additionalClasses} ${btnSizeClass} ${colorClasses} ${
        variant === "icon" ? "" : "border-b-4 rounded"
      } relative flex justify-center items-center font-bold transition-colors ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {loading && (
        <span class="absolute inset-0 flex justify-center items-center">
          <Spinner />
        </span>
      )}
      <span class={loading ? "opacity-0" : "opacity-100"}>
        {props.children}
      </span>
    </button>
  );
}
