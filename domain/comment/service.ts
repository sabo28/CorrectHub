import Report from "../report/report.ts";
import User from "../user/user.ts";
import Timestamp from "../value-objects/timestamp.ts";
import Uuid from "../value-objects/uuid.ts";
import ICommentRepository from "./repository.ts";
import Comment from "./comment.ts";
import IEventService from "../event/service.ts";
import CommentCreationEvent from "./events/comment-creation.ts";
import { NoPermissionToCreateComment } from "./error.ts";

export interface ICommentService {
  create(
    user: User,
    report: Report,
    text: string,
    isAnonym: boolean,
  ): Promise<Comment>;
  getByReportId(reportId: Uuid): Promise<Comment[]>;
}

export class CommentService implements ICommentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly eventService: IEventService,
  ) {}

  async getByReportId(reportId: Uuid): Promise<Comment[]> {
    return await this.commentRepository.getAllByReportId(reportId);
  }

  async create(
    user: User,
    report: Report,
    text: string,
    isAnonym: boolean,
  ): Promise<Comment> {
    if (!user.permissions.canCreateComment(report.user.id)) {
      throw new NoPermissionToCreateComment();
    }

    const comment = new Comment(
      Uuid.newRandom(),
      report.id,
      user,
      isAnonym,
      text,
      Timestamp.now(),
    );

    const savedComment = await this.commentRepository.create(comment);

    await this.eventService.publish(
      new CommentCreationEvent(
        savedComment,
        report.title,
        report.user.id,
        report.user.email,
        user.email,
      ),
    );

    return savedComment;
  }
}
