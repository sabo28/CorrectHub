import IAttachmentRepository from "@domain/attachment/repository.ts";
import Attachment from "@domain/attachment/attachment.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { attachmentSchema } from "./schema.ts";
import AttachmentTransferObject from "./attachmentTransferObject.ts";
import { DatabaseClient } from "./db.ts";
import { eq } from "drizzle-orm";
import { DoesNotExist } from "@domain/attachment/error.ts";

export default class AttachmentRepository implements IAttachmentRepository {
  constructor(private readonly db: DatabaseClient) {}

  async getById(id: Uuid): Promise<Attachment> {
    const result = await this.db.select().from(attachmentSchema).where(
      eq(attachmentSchema.id, id.toString()),
    );

    if (result.length === 0) {
      throw new DoesNotExist(id);
    }

    return new AttachmentTransferObject(result[0]).toAttachment();
  }

  async getByReport(reportId: Uuid): Promise<Attachment[]> {
    const result = await this.db.select().from(attachmentSchema).where(
      eq(attachmentSchema.reportId, reportId.toString()),
    );

    return result.map((row) =>
      new AttachmentTransferObject(row).toAttachment()
    );
  }

  getByCreatedBy(_createdBy: Uuid): Promise<Attachment[]> {
    throw new Error("not implemented");
  }

  delete(_attachmentId: Uuid): Promise<Attachment> {
    throw new Error("not implemented");
  }

  async save(attachment: Attachment): Promise<Attachment> {
    await this.db.insert(attachmentSchema).values(
      AttachmentTransferObject.from(attachment),
    );
    return attachment;
  }
}
