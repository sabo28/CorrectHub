export enum RoleName {
  "MEMBER" = "MEMBER",
  "TUTOR" = "TUTOR",
  "ADMIN" = "ADMIN",
}

export default class Role {
  private readonly _value: RoleName;

  constructor(value: RoleName) {
    if (RoleName[value] == null) {
      throw new Error(`invalid role name '${value}'`);
    }
    this._value = value;
  }

  get value(): RoleName {
    return this._value;
  }

  toString(): string {
    return this._value.toString();
  }

  /**
   * Compares two roles and checks if they are the same
   *
   * @param other role to compare
   * @returns true if roles match
   */
  is(other: Role): boolean {
    return other.value === this._value;
  }

  static readonly Member = new Role(RoleName.MEMBER);
  static readonly Tutor = new Role(RoleName.TUTOR);
  static readonly Admin = new Role(RoleName.ADMIN);
}
