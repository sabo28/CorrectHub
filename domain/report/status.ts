export enum StatusName {
  UNKNOWN = "UNKNOWN",
  // Meldung wurde neu eingereicht
  NEW = "NEW",
  // Meldung wurde abgelehnt
  REJECTED = "REJECTED",
  // Meldung ist gerade in Bearbeitung
  IN_PROGRESS = "IN_PROGRESS",
  // Bearbeitung der Meldung wird geprüft
  IN_REVIEW = "IN_REVIEW",
  // Meldung wurde gelöst
  RESOLVED = "RESOLVED",
}

const defaultLocale = "de";
const localeStatusName: Record<string, Record<StatusName, string>> = {
  de: {
    [StatusName.UNKNOWN]: "Unbekannt",
    [StatusName.NEW]: "Neu",
    [StatusName.REJECTED]: "Abgelehnt",
    [StatusName.IN_PROGRESS]: "In Arbeit",
    [StatusName.IN_REVIEW]: "In der Überprüfung",
    [StatusName.RESOLVED]: "Gelöst und Abgeschlossen",
  },
};

export default class Status {
  private readonly _value: StatusName;

  constructor(value: StatusName) {
    if (StatusName[value] == null) {
      throw new Error(`invalid Status name '${value}'`);
    }
    this._value = value;
  }

  get value(): StatusName {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  toLocale(lang: keyof typeof localeStatusName = defaultLocale): string {
    return localeStatusName[lang][this._value];
  }

  /**
   * Compares two status and checks if they are the same
   *
   * @param other status to compare
   * @returns true if status match
   */
  is(other: Status): boolean {
    return other.value === this._value;
  }

  static readonly New = new Status(StatusName.NEW);
  static readonly Rejected = new Status(StatusName.REJECTED);
  static readonly InProgress = new Status(StatusName.IN_PROGRESS);
  static readonly InReview = new Status(StatusName.IN_REVIEW);
  static readonly Resolved = new Status(StatusName.RESOLVED);
}
