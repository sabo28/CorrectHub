import IUserRepository from "@domain/user/repository.ts";
import ISessionRepository from "@domain/session/repository.ts";
import IEmailTransporter, {
  IEmailEnvelope,
} from "@services/notifications/email/transporter/mod.ts";
import IUserService, { UserService } from "@domain/user/service.ts";
import UserRepository from "../persistence/user.ts";
import { EventService } from "@domain/event/service.ts";
import type { DatabaseClient } from "../persistence/db.ts";
import ISessionService, { SessionService } from "@domain/session/service.ts";
import SessionRepository from "../persistence/session.ts";
import ReportRepository from "../persistence/report.ts";
import ReportLifecycleService from "@domain/report-lifecycle/service.ts";
import IReportService, { ReportService } from "@domain/report/service.ts";
import SiteConfiguration from "@domain/site-configuration/site-configuration.ts";
import MailPit from "@services/notifications/email/transporter/mailpit.ts";
import Resend from "@services/notifications/email/transporter/resend.ts";
import Stage from "@domain/value-objects/stage.ts";
import AttachmentRepository from "../persistence/attachment.ts";
import AttachmentService, {
  IAttachmentService,
} from "@domain/attachment/service.ts";
import { None, Option } from "@utils/option.ts";
import User from "@domain/user/user.ts";
import Session from "@domain/session/session.ts";
import { getCookies } from "$std/http/cookie.ts";
import Uuid from "@domain/value-objects/uuid.ts";
import { Result } from "@utils/result.ts";
import IReportRepository from "@domain/report/repository.ts";
import initializeListeners from "../services/notifications/email/listeners/mod.ts";
import ReportLifecycleRepository from "../persistence/reportLifecycle.ts";
import { CommentService, ICommentService } from "@domain/comment/service.ts";
import CommentRepository from "../persistence/comment.ts";
import PasswordResetTokenService from "@domain/password-reset-token/service.ts";
import IPasswordResetTokenRepository from "@domain/password-reset-token/repository.ts";
import PasswordResetTokenRepository from "../persistence/passwordResetToken.ts";
import IPasswordResetTokenService from "@domain/password-reset-token/service.ts";

export interface IApplication {
  userService: IUserService;
  sessionRepository: ISessionRepository;
  userRepository: IUserRepository;
  reportRepository: IReportRepository;
  sessionService: ISessionService;
  reportService: IReportService;
  reportLifecycleService: ReportLifecycleService;
  attachmentService: IAttachmentService;
  siteConfiguration: SiteConfiguration;
  currentSession: Option<Session>;
  currentUser: Option<User>;
  loggedIn: boolean;
  extendedSession: Option<Session>;
  commentService: ICommentService;
  passwordResetTokenRepository: IPasswordResetTokenRepository;
  passwordResetTokenService: IPasswordResetTokenService;
}

function getBaseUrl(stage: Stage, deploymentId?: string) {
  switch (stage.value) {
    case Stage.PRODUCTION.value:
      return "https://iu-project.deno.dev";

    case Stage.PREVIEW.value:
      return `https://iu-project-${deploymentId}.deno.dev`;

    case Stage.LOCAL.value:
      return "http://localhost:8000";

    default:
      throw new Error("invalid staging");
  }
}

export default class Application implements IApplication {
  readonly userService: IUserService;
  readonly sessionService: ISessionService;
  readonly reportService: IReportService;
  readonly attachmentService: IAttachmentService;
  readonly siteConfiguration: SiteConfiguration;
  readonly reportRepository: IReportRepository;
  readonly reportLifecycleService: ReportLifecycleService;
  readonly sessionRepository: ISessionRepository;
  readonly userRepository: IUserRepository;
  readonly commentService: ICommentService;
  readonly passwordResetTokenRepository: IPasswordResetTokenRepository;
  readonly passwordResetTokenService: IPasswordResetTokenService;

  private _currentSession: Option<Session> = None();
  private _currentUser: Option<User> = None();
  private _extendedSession: Option<Session> = None();

  private readonly request: Request;

  constructor(request: Request, db: DatabaseClient) {
    this.request = request;

    const stage = new Stage(Deno.env.get("DEPLOY_ENV") || "local");
    const baseUrl = getBaseUrl(stage, Deno.env.get("DENO_DEPLOYMENT_ID"));
    this.siteConfiguration = new SiteConfiguration(new URL(baseUrl));

    const attachmentRepository = new AttachmentRepository(db);
    this.userRepository = new UserRepository(db);
    this.sessionRepository = new SessionRepository(db);
    this.reportRepository = new ReportRepository(db, this.userRepository);
    const reportLifecycleRepository = new ReportLifecycleRepository(
      db,
      this.reportRepository,
      this.userRepository,
    );

    this.reportLifecycleService = new ReportLifecycleService(
      reportLifecycleRepository,
    );
    const commentRepository = new CommentRepository(db, this.userRepository);
    this.passwordResetTokenRepository = new PasswordResetTokenRepository(db);

    let emailTransporter: IEmailTransporter = {
      send(envelope: IEmailEnvelope): Promise<boolean> {
        console.log(envelope);
        return Promise.resolve(false);
      },
    };

    if (stage.is(Stage.LOCAL)) {
      emailTransporter = new MailPit("http://mailpit:8025");
    }

    const resendApiKey = Option.from(Deno.env.get("RESEND_API_KEY"));
    if (resendApiKey.isSome()) {
      emailTransporter = new Resend(resendApiKey.unwrap());
    }

    const eventService = new EventService();
    initializeListeners(
      eventService,
      this.siteConfiguration,
      emailTransporter,
      this.reportLifecycleService,
      this.userRepository,
    );

    this.userService = new UserService(this.userRepository, eventService);
    this.sessionService = new SessionService(
      this.userRepository,
      this.sessionRepository,
    );
    this.reportService = new ReportService(
      this.reportRepository,
      eventService,
    );
    this.attachmentService = new AttachmentService(attachmentRepository);
    this.commentService = new CommentService(commentRepository, eventService);
    this.passwordResetTokenService = new PasswordResetTokenService(
      this.userRepository,
      this.passwordResetTokenRepository,
      eventService,
    );
  }

  async init() {
    await this.userService.assertDemoUsers();

    this._currentSession = await getSessionFromRequest(
      this.request,
      this.sessionRepository,
      this.siteConfiguration,
    );

    this._currentUser = await getUserFromCurrentSession(
      this._currentSession,
      this.userRepository,
    );

    //Session abgelaufen
    if (!this.loggedIn) {
      this._currentUser = None();
      this._extendedSession = None();
      return;
    }

    //Session verlängern wenn aktiv
    const session = this._currentSession.unwrap();
    const extended = await this.sessionService.extendSession(session);
    this._extendedSession = Option.from(extended);
  }

  get currentSession(): Option<Session> {
    return this._currentSession;
  }

  get currentUser(): Option<User> {
    return this._currentUser;
  }

  get extendedSession(): Option<Session> {
    return this._extendedSession;
  }

  get loggedIn(): boolean {
    if (this._currentSession.isNone() || this._currentUser.isNone()) {
      return false;
    }
    return this._currentSession.unwrap().isActive;
  }
}

async function getSessionFromRequest(
  request: Request,
  sessionRepository: ISessionRepository,
  siteConfiguration: SiteConfiguration,
): Promise<Option<Session>> {
  const cookies = getCookies(request.headers);
  const sessionCookie = Option.from(
    cookies[siteConfiguration.sessionCookieName],
  );

  if (sessionCookie.isNone()) {
    return None();
  }

  const sessionId = new Uuid(sessionCookie.unwrap());
  const sessionResult = await Result.from(sessionRepository.getById(sessionId));

  if (sessionResult.isErr()) {
    return None();
  }

  const session = sessionResult.unwrap();

  return session.isActive ? Option.from(session) : None();
}

async function getUserFromCurrentSession(
  session: Option<Session>,
  userRepository: IUserRepository,
): Promise<Option<User>> {
  if (session.isNone()) {
    return None();
  }

  const sessionObj = session.unwrap();
  const userResult = await Result.from(
    userRepository.getById(sessionObj.userId),
  );

  return userResult.ok();
}
