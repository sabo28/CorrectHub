import { Buffer } from "node:buffer";
import Uuid from "../value-objects/uuid.ts";
import Timestamp from "../value-objects/timestamp.ts";
// import sharp from "npm:sharp";

export default class Attachment {
  constructor(
    readonly id: Uuid,
    readonly reportId: Uuid,
    readonly createdBy: Uuid,
    readonly mime: string,
    readonly data: Buffer,
    readonly createdAt: Timestamp,
    readonly updatedAt: Timestamp,
  ) {
    if (id == null) throw new Error("missing id");
    if (reportId == null) throw new Error("missing reportId");
    if (createdBy == null) throw new Error("missing createdBy");
    if (mime == null) throw new Error("missing mime");
    if (data == null) throw new Error("missing data");
    if (createdAt == null) throw new Error("missing createdAt");
    if (updatedAt == null) throw new Error("missing updatedAt");
  }
}
