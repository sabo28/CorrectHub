export default class Link {
  readonly value: URL;

  constructor(value: string) {
    this.value = new URL(
      /^http(s)?:\/\//.test(value) ? value : "https://" + value,
    );
  }

  toString() {
    return this.value.toString();
  }

  static linksFrom(value: string): Link[] {
    return value.split("\n").filter(Boolean).map((l) => new Link(l));
  }

  static fromArray(values: string[]): Link[] {
    return values.map((l) => new Link(l));
  }
}
