import { format, formatRelative } from "npm:date-fns";
import { de } from "date-fns/locale";

export interface IRelativeDate {
  class?: string;
}

export interface IRelativeDateMillis extends IRelativeDate {
  unixMillis: number;
}

export interface IRelativeDateSeconds extends IRelativeDate {
  unixSeconds: number;
}

export default function RelativeDate(
  props: IRelativeDateMillis | IRelativeDateSeconds,
) {
  const millis = (props as IRelativeDateMillis).unixMillis ??
    (props as IRelativeDateSeconds).unixSeconds * 1000;

  const date = new Date(millis);
  const options = { locale: de };
  const formatted = format(date, "PPPpp", options);
  const relative = formatRelative(date, new Date(), options);

  return <span class={props.class} title={formatted}>{relative}</span>;
}
