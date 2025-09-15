import Uuid from "../value-objects/uuid.ts";
import Role from "./role.ts";

export class UserPermission {
  constructor(
    private readonly role: Role,
    private readonly userId: Uuid,
  ) {}

  has(role: Role): boolean {
    return this.role.is(role);
  }

  hasOneOf(rolesToCheck: Role[]): boolean {
    return rolesToCheck.some((r) => this.has(r));
  }

  isAdmin(): boolean {
    return this.has(Role.Admin);
  }

  canViewAllReports(): boolean {
    return this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canViewUsers(): boolean {
    return this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canChangeUserRole(): boolean {
    return this.has(Role.Admin);
  }

  canViewReport(reportAuthorId: Uuid): boolean {
    const userIsAuthor = this.userId.toString() === reportAuthorId.toString();
    return userIsAuthor || this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canCreateReport(): boolean {
    return this.hasOneOf([Role.Member, Role.Tutor, Role.Admin]);
  }

  canEditReport(reportAuthorId: Uuid): boolean {
    return this.userId.toString() === reportAuthorId.toString() ||
      this.hasOneOf([Role.Admin, Role.Tutor]);
  }

  canChangeStatus(): boolean {
    return this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canChangePriority(): boolean {
    return this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canChangeAssignee(): boolean {
    return this.hasOneOf([Role.Tutor, Role.Admin]);
  }

  canCreateComment(reportAuthorId: Uuid): boolean {
    // Admins und Moderatoren dürfen immer kommentieren
    if (this.hasOneOf([Role.Admin, Role.Tutor])) return true;

    // Author der Meldung darf kommentieren
    return this.userId.toString() === reportAuthorId.toString();
  }
}
