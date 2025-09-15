import CommentTransferObject from "./commentTransferObject.ts";
import Comment from "@domain/comment/comment.ts";
import ICommentRepository from "@domain/comment/repository.ts";
import { commentSchema } from "./schema.ts";
import { eq } from "drizzle-orm";
import { DatabaseClient } from "./db.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { CommentDoesNotExist } from "@domain/comment/error.ts";
import IUserRepository from "@domain/user/repository.ts";

export default class CommentRepository implements ICommentRepository {
  constructor(
    private readonly db: DatabaseClient,
    private readonly userRepository: IUserRepository,
  ) {}

  async getById(id: Uuid): Promise<Comment> {
    const result = await this.db.select().from(commentSchema).where(
      eq(commentSchema.id, id.toString()),
    );

    if (result.length === 0) {
      throw new CommentDoesNotExist(id);
    }

    const user = await this.userRepository.getById(new Uuid(result[0].userId));
    return new CommentTransferObject(result[0]).toComment(user);
  }

  async getAllByReportId(reportId: Uuid): Promise<Comment[]> {
    const results = await this.db.select().from(commentSchema).where(
      eq(commentSchema.reportId, reportId.toString()),
    );

    return Promise.all(
      results.map(async (row) => {
        const user = await this.userRepository.getById(new Uuid(row.userId));
        return new CommentTransferObject(row).toComment(user);
      }),
    );
  }

  async create(comment: Comment): Promise<Comment> {
    await this.db.insert(commentSchema).values(
      CommentTransferObject.from(comment),
    );
    return comment;
  }
}
