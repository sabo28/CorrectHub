import Uuid from "@domain/value-objects/uuid.ts";
import {
  EmailAlreadyExists,
  EmailDoesNotExist,
  InvalidVerificationCode,
} from "./error.ts";
import { Result } from "@utils/result.ts";
import Email from "../value-objects/email.ts";
import Password from "../value-objects/password.ts";
import IUserRepository from "./repository.ts";
import User from "./user.ts";
import Timestamp from "../value-objects/timestamp.ts";
import VerificationCode from "./verification-code.ts";
import IEventService from "../event/service.ts";
import UserCreationEvent from "./events/creation.ts";
import Role, { RoleName } from "./role.ts";

export default interface IUserService {
  register(name: string, email: string, password: string): Promise<User>;
  verify(code: string): Promise<User>;
  availableAssignees(): Promise<User[]>;
  list(orderBy?: string, direction?: boolean): Promise<User[]>;
  updateRole(userId: string, newRole: RoleName): Promise<User>;
  updatePassword(userId: Uuid, newPassword: string): Promise<User>;
  assertDemoUsers(): Promise<void>;
}

export class UserService implements IUserService {
  constructor(
    private readonly repository: IUserRepository,
    private readonly eventService: IEventService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const newEmail = new Email(email);

    const user = await Result.from(this.repository.getByEmail(newEmail));
    if (user.isOk()) {
      throw new EmailAlreadyExists(user.unwrap().email);
    } else if (!(user.unwrapErr() instanceof EmailDoesNotExist)) {
      throw user.unwrapErr();
    }

    const hashedPassword = Password.hash(password);
    const now = Timestamp.now();
    const newUser = new User(
      Uuid.newRandom(),
      name,
      newEmail,
      false,
      VerificationCode.newRandom(newEmail),
      hashedPassword,
      Role.Member,
      now,
      now,
    );

    // TODO: Add notification and email to new user
    await this.repository.save(newUser);
    await this.eventService.publish(new UserCreationEvent(newUser));

    return newUser;
  }

  async verify(code: string): Promise<User> {
    const verificationCode = await Result.from(() =>
      new VerificationCode(code)
    );
    if (verificationCode.isErr()) {
      throw new InvalidVerificationCode();
    }

    const user = await this.repository.getByEmail(
      verificationCode.unwrap().email,
    );

    if (!user.verificationCode.verify(verificationCode.unwrap())) {
      throw new InvalidVerificationCode();
    }

    if (user.emailVerified) {
      return user;
    }

    user.emailVerified = true;
    return this.repository.update(user);
  }

  availableAssignees(): Promise<User[]> {
    return this.repository.getByRoles([Role.Admin, Role.Tutor]);
  }

  list(orderBy?: string, direction?: boolean): Promise<User[]> {
    return this.repository.list(orderBy, direction);
  }

  async updateRole(userId: string, newRole: RoleName): Promise<User> {
    const user = await this.repository.getById(new Uuid(userId));
    user.role = new Role(RoleName[newRole]);

    const updatedUser = await this.repository.update(user);

    return updatedUser;
  }

  async updatePassword(userId: Uuid, newPassword: string): Promise<User> {
    const user = await this.repository.getById(userId);

    user.password = Password.hash(newPassword);
    return this.repository.update(user);
  }

  async assertDemoUsers(): Promise<void> {
    const usernames = ["admin", "tutor", "member"] as const;
    const roles: Record<typeof usernames[number], Role> = {
      admin: Role.Admin,
      tutor: Role.Tutor,
      member: Role.Member,
    };

    for (const username of usernames) {
      const user = await Result.from(this.repository.getByUsername(username));

      // Sollte der Benutzer bereits existieren, wird das Passwort auf den
      // Benutzernamen gleichgesetzt und die Rolle resetted
      if (user.isOk()) {
        // Benutzername = Passwort
        if (!user.unwrap().password.verify(username)) {
          await this.updatePassword(user.unwrap().id, username);
        }

        // Benutzername = Rolle
        if (!user.unwrap().role.is(roles[username])) {
          await this.updateRole(
            user.unwrap().id.toString(),
            roles[username].value,
          );
        }
      }

      // Bei einem Fehler gehen wir einfach mal davon aus, dass der Benutzer
      // noch nicht existiert und wir legen ihn einfach an.
      if (user.isErr()) {
        const email = new Email(`lumio+iu-${username}@lumio.at`);
        const role = roles[username];
        const newUser = new User(
          Uuid.newRandom(),
          username,
          email,
          true,
          VerificationCode.newRandom(email),
          Password.hash(username),
          role,
          Timestamp.now(),
          Timestamp.now(),
        );

        await this.repository.save(newUser);
      }
    }
  }
}
