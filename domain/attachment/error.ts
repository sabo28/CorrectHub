import Uuid from "../value-objects/uuid.ts";

export class DoesNotExist extends Error {
  override name = "AttachmentDoesNotExist";

  constructor(readonly id: Uuid) {
    super(`Attachment with id '${id.toString()}' does not exist`);
  }
}
