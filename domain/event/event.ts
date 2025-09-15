export default abstract class Event {
  is<T>(event: unknown): event is T {
    if (event == null) {
      return false;
    }

    return event.constructor === this.constructor;
  }
}
