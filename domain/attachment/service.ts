import IAttachmentRepository from "@domain/attachment/repository.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { Buffer } from "node:buffer";
import Attachment from "./attachment.ts";
import Timestamp from "../value-objects/timestamp.ts";

export interface IAttachmentService {
  create(
    reportId: Uuid,
    createdBy: Uuid,
    mime: string,
    data: Buffer,
  ): Promise<Attachment>;

  get(id: Uuid): Promise<Attachment>;

  listByReport(reportId: Uuid): Promise<Attachment[]>;
}

export default class AttachmentService implements IAttachmentService {
  constructor(private readonly repository: IAttachmentRepository) {}

  create(
    reportId: Uuid,
    createdBy: Uuid,
    mime: string,
    data: Buffer,
  ): Promise<Attachment> {
    const attachment = new Attachment(
      Uuid.newRandom(),
      reportId,
      createdBy,
      mime,
      data,
      Timestamp.now(),
      Timestamp.now(),
    );

    return this.repository.save(attachment);
  }

  get(id: Uuid): Promise<Attachment> {
    return this.repository.getById(id);
  }

  listByReport(reportId: Uuid): Promise<Attachment[]> {
    return this.repository.getByReport(reportId);
  }
}
