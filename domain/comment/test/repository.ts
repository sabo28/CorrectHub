import Uuid from "../../value-objects/uuid.ts";
import Comment from "../comment.ts";
import ICommentRepository from "../repository.ts";

type CommentTestRepositoryOverrideFunctions = Partial<
  Record<keyof CommentTestRepository, () => Promise<Comment | Comment[]>>
>;

export default class CommentTestRepository implements ICommentRepository {
  private store: Record<string, Comment> = {};
  private overrideFunctions: CommentTestRepositoryOverrideFunctions;

  constructor(overrideFunctions?: CommentTestRepositoryOverrideFunctions) {
    this.overrideFunctions = overrideFunctions ?? {};
  }

  create(comment: Comment): Promise<Comment> {
    if (this.overrideFunctions.create) {
      return this.overrideFunctions.create() as Promise<Comment>;
    }

    const cloned = Object.assign(
      Object.create(Object.getPrototypeOf(comment)),
      comment,
    );
    this.store[comment.id.toString()] = cloned;
    return Promise.resolve(cloned);
  }

  getById(id: Uuid): Promise<Comment> {
    if (this.overrideFunctions.getById) {
      return this.overrideFunctions.getById() as Promise<Comment>;
    }

    const comment = this.store[id.toString()];
    if (!comment) {
      return Promise.reject(new Error(`Comment not found: ${id.toString()}`));
    }

    return Promise.resolve(
      Object.assign(Object.create(Object.getPrototypeOf(comment)), comment),
    );
  }

  getAllByReportId(reportId: Uuid): Promise<Comment[]> {
    if (this.overrideFunctions.getAllByReportId) {
      return this.overrideFunctions.getAllByReportId() as Promise<Comment[]>;
    }

    const comments = Object.values(this.store).filter((c) =>
      c.reportId.toString() === reportId.toString()
    );

    return Promise.resolve(
      comments.map((c) =>
        Object.assign(Object.create(Object.getPrototypeOf(c)), c)
      ),
    );
  }
}
