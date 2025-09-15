import Event from "./event.ts";

// deno-lint-ignore no-explicit-any
export type AcceptedEvent = new (...args: any[]) => Event;

export default interface ISubscriber {
  /**
   * Specify which events are accepted by the subscriber
   */
  acceptedEvents?: AcceptedEvent[];

  /**
   * Notify subscriber of a new event. Returning a true value will indicate
   * that a subscriber acted on an event.
   */
  notify(event: unknown): Promise<boolean>;
}
