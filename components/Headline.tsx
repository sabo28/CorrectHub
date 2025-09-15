import { JSX } from "preact";

interface HeadlineProps {
  children: JSX.Element | string;
  level?: 1 | 2 | 3 | 4 | 5 | 6; // für <h1> bis <h6>
  class?: string; // für zusätzliche Klassen
}

export default function Headline({
  children,
  level = 1,
  class: extraClass = "",
}: HeadlineProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      class={`text-3xl font-bold text-gray-800 text-center ${extraClass}`}
    >
      {children}
    </Tag>
  );
}
