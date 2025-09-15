const EMAIL_PATTERN =
  /^((?!\.)[\w\-_.+]*[^.])(@[\w\-_]+)(\.\w+(\.\w+)?[^.\W])$/;

export default class Email {
  private readonly value: string;

  constructor(value: string | Email) {
    if (value == null) {
      throw new Error(`invalid email address`);
    }

    if (typeof value === "string") {
      if (!EMAIL_PATTERN.test(value)) {
        throw new Error(`invalid email address: '${value}'`);
      }

      this.value = value.toLowerCase();
    } else {
      this.value = value.value;
    }
  }

  toString() {
    return this.value;
  }
}
