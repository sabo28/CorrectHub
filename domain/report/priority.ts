export const priorityLocalMap: Record<string, string> = {
  10: "Niedrig",
  20: "Normal",
  30: "Hoch",
  40: "Kritisch",
};

export default class Priority {
  constructor(readonly value: number) {
    if (!Object.keys(priorityLocalMap).includes(value.toString())) {
      throw new Error(`Priority: invalid value '${value}'`);
    }
  }

  toLocale(): string {
    return priorityLocalMap[this.value.toString()];
  }

  static readonly Low = new Priority(10);
  static readonly Normal = new Priority(20);
  static readonly High = new Priority(30);
}
