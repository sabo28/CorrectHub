const UUID_PATTERN =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export default class Uuid {
  private value: string;

  constructor(value: string) {
    if (!UUID_PATTERN.test(value)) {
      throw new Error(`invalid uuid: '${value}'`);
    }

    this.value = value.toLowerCase();
  }

  toString() {
    return this.value;
  }

  static newRandom(): Uuid {
    const rawUuid = crypto.randomUUID();
    return new Uuid(rawUuid);
  }
}
