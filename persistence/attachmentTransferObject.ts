import Attachment from "@domain/attachment/attachment.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { Buffer } from "node:buffer";
import Timestamp from "@domain/value-objects/timestamp.ts";

interface AttachmentTransferObjectInput {
  id: string;
  reportId: string;
  createdBy: string;
  mime: string;
  data: Buffer;
  preview: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

export default class AttachmentTransferObject {
  readonly id: string;
  readonly reportId: string;
  readonly createdBy: string;
  readonly mime: string;
  readonly data: Buffer;
  readonly preview: Buffer;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(dbAttachment: AttachmentTransferObjectInput) {
    this.id = dbAttachment.id;
    this.reportId = dbAttachment.reportId;
    this.createdBy = dbAttachment.createdBy;
    this.mime = dbAttachment.mime;
    this.data = dbAttachment.data;
    this.preview = dbAttachment.preview;
    this.createdAt = dbAttachment.createdAt;
    this.updatedAt = dbAttachment.updatedAt;
  }

  toAttachment(): Attachment {
    return new Attachment(
      new Uuid(this.id),
      new Uuid(this.reportId),
      new Uuid(this.createdBy),
      this.mime,
      Buffer.from(this.data),
      new Timestamp(this.createdAt),
      new Timestamp(this.updatedAt),
    );
  }

  static from(attachment: Attachment): AttachmentTransferObject {
    return new AttachmentTransferObject({
      id: attachment.id.toString(),
      reportId: attachment.reportId.toString(),
      createdBy: attachment.createdBy.toString(),
      mime: attachment.mime,
      data: attachment.data,
      preview: Buffer.from(""),
      createdAt: attachment.createdAt.toDate(),
      updatedAt: attachment.updatedAt.toDate(),
    });
  }
}
