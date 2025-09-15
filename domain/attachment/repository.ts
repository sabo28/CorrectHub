import Uuid from "../value-objects/uuid.ts";
import Attachment from "./attachment.ts";

export default interface IAttachmentRepository {
  save(attachment: Attachment): Promise<Attachment>;

  getById(id: Uuid): Promise<Attachment>;

  getByReport(id: Uuid): Promise<Attachment[]>;

  getByCreatedBy(createdBy: Uuid): Promise<Attachment[]>;

  delete(attachmentId: Uuid): Promise<Attachment>;
}
