export default class Stage {
  readonly value: string;

  constructor(value: string) {
    if (!["production", "preview", "local"].includes(value)) {
      throw new Error(`invalid stage '${value}'`);
    }

    this.value = value;
  }

  toString() {
    return this.value;
  }

  is(other: Stage) {
    return other.value === this.value;
  }

  static PRODUCTION = new Stage("production");
  static PREVIEW = new Stage("preview");
  static LOCAL = new Stage("local");
}
