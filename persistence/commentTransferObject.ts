import Comment from "@domain/comment/comment.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Timestamp from "@domain/value-objects/timestamp.ts";
import User from "@domain/user/user.ts";

interface CommentTransferObjectInput {
  id: string;
  reportId: string;
  userId: string;
  isAnonym: boolean;
  text: string;
  createdAt: Date;
}

export default class CommentTransferObject {
  readonly id: string;
  readonly reportId: string;
  readonly userId: string;
  readonly isAnonym: boolean;
  readonly text: string;
  readonly createdAt: Date;

  constructor(dbComment: CommentTransferObjectInput) {
    this.id = dbComment.id;
    this.reportId = dbComment.reportId;
    this.userId = dbComment.userId;
    this.isAnonym = dbComment.isAnonym;
    this.text = dbComment.text;
    this.createdAt = dbComment.createdAt;
  }

  toComment(user: User): Comment {
    return new Comment(
      new Uuid(this.id),
      new Uuid(this.reportId),
      user,
      this.isAnonym,
      this.text,
      new Timestamp(this.createdAt),
    );
  }

  static from(comment: Comment): CommentTransferObject {
    return new CommentTransferObject({
      id: comment.id.toString(),
      reportId: comment.reportId.toString(),
      userId: comment.userId.toString(),
      isAnonym: comment.isAnonym,
      text: comment.text,
      createdAt: comment.createdAt.toDate(),
    });
  }
}
