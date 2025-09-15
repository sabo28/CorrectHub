import Uuid from "../value-objects/uuid.ts";
import Email from "../value-objects/email.ts";
import Password from "../value-objects/password.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Role, { RoleName } from "./role.ts";
import VerificationCode from "./verification-code.ts";
import { UserPermission } from "./userPermission.ts";

export interface IPrimitiveUser {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  role: RoleName;
  createdAtMillis: number;
  updatedAtMillis: number;
}

export default class User {
  constructor(
    public readonly id: Uuid,
    public username: string,
    public email: Email,
    public emailVerified: boolean,
    public verificationCode: VerificationCode,
    public password: Password,
    public role: Role,
    public createdAt: Timestamp,
    public updatedAt: Timestamp,
  ) {}

  toPrimitive(): IPrimitiveUser {
    return {
      id: this.id.toString(),
      username: this.username,
      email: this.email.toString(),
      emailVerified: this.emailVerified,
      role: this.role.value,
      createdAtMillis: this.createdAt.toUnixMillis(),
      updatedAtMillis: this.updatedAt.toUnixMillis(),
    };
  }

  toString(): string {
    return this.id.toString();
  }

  get permissions(): UserPermission {
    return new UserPermission(this.role, this.id);
  }

  static fieldToPrimitiveMap(
    field: keyof User,
  ): keyof IPrimitiveUser | undefined {
    switch (field) {
      case "id":
        return "id";
      case "username":
        return "username";
      case "email":
        return "email";
      case "emailVerified":
        return "emailVerified";
      case "role":
        return "role";
      case "createdAt":
        return "createdAtMillis";
      case "updatedAt":
        return "updatedAtMillis";
    }
  }

  static primitiveToFieldMap(
    primitiveField: keyof IPrimitiveUser,
  ): keyof User | undefined {
    switch (primitiveField) {
      case "id":
        return "id";
      case "username":
        return "username";
      case "email":
        return "email";
      case "emailVerified":
        return "emailVerified";
      case "role":
        return "role";
      case "createdAtMillis":
        return "createdAt";
      case "updatedAtMillis":
        return "updatedAt";
    }
  }
}
