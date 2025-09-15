import { z } from "zod/v4";
import Uuid from "@domain/value-objects/uuid.ts";
import { IApplication } from "./application.ts";
import { Unauthorized } from "./errors.ts";

export const AttachmentId = z.uuid();

export default class AttachmentHandler {
  constructor(private readonly app: IApplication) {}

  async get(id: string): Promise<Response> {
    if (!this.app.loggedIn) {
      throw new Unauthorized();
    }

    const uuid = new Uuid(AttachmentId.parse(id));
    const attachment = await this.app.attachmentService.get(uuid);

    return new Response(attachment.data, {
      headers: {
        "Content-Type": attachment.mime,
      },
    });
  }
}
