import ISubscriber, { AcceptedEvent } from "./subscriber.ts";
import Event from "./event.ts";

export default interface IEventService {
  /**
   * Registers a subscriber
   */
  subscribe(subscriber: ISubscriber): IEventService;

  /**
   * Publish an event to the event pool
   */
  publish(event: Event): Promise<void>;
}

export class EventService implements IEventService {
  private subscribers: ISubscriber[] = [];

  subscribe(subscriber: ISubscriber): IEventService {
    this.subscribers.push(subscriber);
    return this;
  }

  async publish(event: Event): Promise<void> {
    const subscribers = Object.values(this.subscribers);
    const promises: Promise<boolean>[] = [];

    for (const subscriber of subscribers) {
      if (!this.shouldBeNotified(event, subscriber)) {
        continue;
      }

      promises.push(subscriber.notify(event));
    }

    await Promise.all(promises);
  }

  private shouldBeNotified(event: Event, subscriber: ISubscriber): boolean {
    if (
      subscriber.acceptedEvents == null || !subscriber.acceptedEvents.length
    ) {
      return true;
    }

    return subscriber.acceptedEvents.some((acceptedEvent: AcceptedEvent) => {
      return event.constructor == acceptedEvent;
    });
  }
}
