import Uuid from "../value-objects/uuid.ts";
import Comment from "./comment.ts";

export default interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;

  getById(id: Uuid): Promise<Comment>;

  getAllByReportId(id: Uuid): Promise<Comment[]>;
}
