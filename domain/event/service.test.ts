import ISubscriber, { AcceptedEvent } from "./subscriber.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";
import { EventService } from "./service.ts";
import Event from "./event.ts";

Deno.test("EventService notifies subscribers", async () => {
  let called = 0;

  const service = new EventService();

  class TestSubscriber implements ISubscriber {
    notify(): Promise<boolean> {
      called += 1;
      return Promise.resolve(true);
    }
  }

  // First subscriber
  service.subscribe(new TestSubscriber());
  // Second subscriber
  service.subscribe(new TestSubscriber());

  class TestEvent extends Event {
  }
  await service.publish(new TestEvent());

  assertEquals(called, 2);
});

Deno.test("EventService correctly filters for event types", async () => {
  let called = 0;

  const service = new EventService();

  class TestEvent1 extends Event {}
  class TestEvent2 extends Event {}
  class TestSubscriber implements ISubscriber {
    acceptedEvents: AcceptedEvent[] = [TestEvent1];

    notify(): Promise<boolean> {
      called += 1;
      return Promise.resolve(true);
    }
  }

  service.subscribe(new TestSubscriber());

  assertEquals(called, 0);

  await service.publish(new TestEvent1());
  assertEquals(called, 1);

  await service.publish(new TestEvent2());
  assertEquals(called, 1);

  await service.publish(new TestEvent1());
  assertEquals(called, 2);
});
