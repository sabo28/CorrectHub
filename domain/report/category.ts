export enum CategoryName {
  CONTENT_ERROR = "CONTENT_ERROR",
  IMPROVEMENT_SUGGESTION = "IMPROVEMENT_SUGGESTION",
  OTHER = "OTHER",
}

const defaultLocale = "de";
const localeCategoryName: Record<string, Record<CategoryName, string>> = {
  de: {
    [CategoryName.CONTENT_ERROR]: "Inhaltlicher Fehler",
    [CategoryName.IMPROVEMENT_SUGGESTION]: "Verbesserungsvorschlag",
    [CategoryName.OTHER]: "Sonstige",
  },
};

export default class ReportCategory {
  private readonly _value: CategoryName;

  constructor(value: CategoryName) {
    if (CategoryName[value] == null) {
      throw new Error(`invalid Category name '${value}'`);
    }
    this._value = value;
  }

  get value(): CategoryName {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  toLocale(lang: keyof typeof localeCategoryName = defaultLocale): string {
    return localeCategoryName[lang][this._value];
  }

  /**
   * Compares two categories and checks if they are the same
   *
   * @param other category to compare
   * @returns true if category match
   */
  is(other: ReportCategory): boolean {
    return other.value === this._value;
  }

  static readonly ContentError = new ReportCategory(CategoryName.CONTENT_ERROR);
  static readonly ImprovementSuggestion = new ReportCategory(
    CategoryName.IMPROVEMENT_SUGGESTION,
  );
  static readonly Other = new ReportCategory(CategoryName.OTHER);

  static from(value: string): ReportCategory {
    const name = CategoryName[value as CategoryName];
    if (name == null) {
      throw new Error(`ReportCategory.from: Invalid value '${value}'`);
    }

    return new ReportCategory(name);
  }
}
