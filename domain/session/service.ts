import IUserRepository from "../user/repository.ts";
import Session from "./session.ts";
import Email from "../value-objects/email.ts";
import { Result } from "@utils/result.ts";
import ISessionRepository from "./repository.ts";
import {
  InvalidCredentialsWithEmail,
  InvalidCredentialsWithUsername,
} from "./error.ts";
import { EmailNotVerified } from "./error.ts";
import Uuid from "../value-objects/uuid.ts";
import Timestamp, { TimeUnit } from "../value-objects/timestamp.ts";

export default interface ISessionService {
  login(identifier: string, password: string): Promise<Session>;
  loginByEmail(email: string, password: string): Promise<Session>;
  loginByUsername(username: string, password: string): Promise<Session>;
  logout(sessionId: Uuid): Promise<Session>;
  extendSession(session: Session): Promise<Session>;
}

export class SessionService implements ISessionService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  login(identifier: string, password: string): Promise<Session> {
    if (identifier.includes("@")) {
      return this.loginByEmail(identifier, password);
    }

    return this.loginByUsername(identifier, password);
  }

  async loginByEmail(email: string, password: string): Promise<Session> {
    const newEmail = new Email(email);
    const user = await Result.from(this.userRepository.getByEmail(newEmail));
    if (user.isErr()) {
      throw new InvalidCredentialsWithEmail(newEmail);
    }

    if (!user.unwrap().password.verify(password)) {
      throw new InvalidCredentialsWithEmail(newEmail);
    }

    if (!user.unwrap().emailVerified) {
      throw new EmailNotVerified(newEmail);
    }

    const now = Timestamp.now();
    const newSession = new Session(
      Uuid.newRandom(),
      user.unwrap().id,
      now,
      Timestamp.in(30, TimeUnit.MINUTES),
      now,
    );

    await this.sessionRepository.save(newSession);

    return newSession;
  }

  async loginByUsername(userName: string, password: string): Promise<Session> {
    const user = await Result.from(this.userRepository.getByUsername(userName));
    if (user.isErr()) {
      throw new InvalidCredentialsWithUsername(userName);
    }

    if (!user.unwrap().password.verify(password)) {
      throw new InvalidCredentialsWithUsername(userName);
    }

    if (!user.unwrap().emailVerified) {
      throw new EmailNotVerified(user.unwrap().email);
    }

    const newSession = Session.newWith(user.unwrap().id);

    await this.sessionRepository.save(newSession);

    return newSession;
  }

  async logout(sessionId: Uuid): Promise<Session> {
    const session = await this.sessionRepository.getById(sessionId);
    await this.sessionRepository.delete(session);

    return session;
  }

  async extendSession(session: Session): Promise<Session> {
    const now = Timestamp.now();
    const extendedSession = new Session(
      session.id,
      session.userId,
      session.createdAt,
      Timestamp.in(30, TimeUnit.MINUTES),
      now,
    );

    await this.sessionRepository.update(extendedSession);

    return extendedSession;
  }
}
