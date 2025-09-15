import Uuid from "../value-objects/uuid.ts";

export class ReportDoesNotExist extends Error {
  override name = "ReportDoesNotExist";

  constructor(id: Uuid) {
    super(`Report with id '${id.toString()}' does not exist`);
  }
}

export class ReportWithUserIdDoesNotExist extends Error {
  private readonly userId: Uuid;
  override name = "ReportWithUserIdDoesNotExist";

  constructor(userId: Uuid) {
    super();
    this.userId = userId;
  }

  override get message(): string {
    return `Report with user id '${this.userId.toString()}' does not exist`;
  }
}

export class ReportAlreadyExists extends Error {
  constructor(id: Uuid) {
    super(`Report with id '${id.toString()}' already exists`);
  }
}

export class NoPermissionToUpdateReport extends Error {
  constructor(id: Uuid) {
    super(
      `Report with id '${id.toString()}' cannot be changed due to lack of permissions`,
    );
  }
}

export class NoPermissionToUpdateStatus extends Error {
  override name = "ReportNoPermissionToUpdateStatus";

  constructor(id: Uuid) {
    super(
      `Status of report with id '${id.toString()}' cannot be changed due to lack of permissions`,
    );
  }
}

export class NoPermissionToUpdateField extends Error {
  override name = "ReportNoPermissionToUpdateStatus";

  constructor(id: Uuid, fieldName: string) {
    super(
      `Field '${fieldName}' of report with id '${id.toString()}' cannot be changed due to lack of permissions`,
    );
  }
}
