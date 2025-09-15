import { z } from "zod/v4";
import Uuid from "@domain/value-objects/uuid.ts";
import { requestDataToObject } from "@utils/requestDataToObject.ts";
import { IApplication } from "./application.ts";
import Comment from "@domain/comment/comment.ts";

const CommentInput = z.object({
  text: z.string(),
  isAnonym: z.string().default("false"),
});

export default class CommentHandler {
  constructor(private readonly app: IApplication) {}

  async create(request: Request, reportId: string): Promise<Response> {
    const maybeData = await requestDataToObject<unknown>(request);
    if (maybeData.isErr()) throw maybeData.unwrapErr();

    const input = CommentInput.parse(maybeData.unwrap());
    const { text, isAnonym } = input;

    if (!this.app.loggedIn) throw new Error("Unauthorized");

    const user = this.app.currentUser.unwrap();

    const anonym = isAnonym === "true";

    const report = await this.app.reportRepository.getById(new Uuid(reportId));

    const comment = await this.app.commentService.create(
      user,
      report,
      text,
      anonym,
    );

    return new Response(
      JSON.stringify(this.toResponse(comment)),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  private toResponse(comment: Comment) {
    return {
      id: comment.id.toString(),
      report_id: comment.reportId.toString(),
      user_id: comment.userId.toString(),
      user_name: comment.displayUserName,
      text: comment.text,
      created_at: comment.createdAt.toUnix(),
    };
  }
}
