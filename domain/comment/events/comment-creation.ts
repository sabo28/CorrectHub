import Event from "@domain/event/event.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import Email from "@domain/value-objects/email.ts";
import ReportComment from "../comment.ts";

export default class CommentCreationEvent extends Event {
  readonly commentId: Uuid;
  readonly reportId: Uuid;
  readonly reportTitle: string;
  readonly reportAuthorId: Uuid;
  readonly reportAuthorEmail: Email;
  readonly commentAuthorId: Uuid;
  readonly commentAuthorEmail: Email;
  readonly commentText: string;

  constructor(
    comment: ReportComment,
    reportTitle: string,
    reportAuthorId: Uuid,
    reportAuthorEmail: Email,
    commentAuthorEmail: Email,
  ) {
    super();

    this.commentId = comment.id;
    this.reportId = comment.reportId;
    this.reportTitle = reportTitle;
    this.reportAuthorId = reportAuthorId;
    this.reportAuthorEmail = reportAuthorEmail;
    this.commentAuthorId = comment.userId;
    this.commentAuthorEmail = commentAuthorEmail;
    this.commentText = comment.text;
  }
}
