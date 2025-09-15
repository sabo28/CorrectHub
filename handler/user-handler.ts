import { Unauthorized } from "./errors.ts";
import { RoleName } from "@domain/user/role.ts";
import User from "@domain/user/user.ts";
import { requestDataToObject } from "@utils/requestDataToObject.ts";
import { z } from "zod/v4";
import IUserService from "@domain/user/service.ts";

const RegisterInput = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});

const UpdateRoleInput = z.object({
  id: z.uuid(),
  new_role: z.enum(Object.keys(RoleName)),
});

export const UserResponse = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

type UserResponse = z.infer<typeof UserResponse>;

export default class UserHandler {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async create(request: Request): Promise<UserResponse> {
    const maybeData = await requestDataToObject<unknown>(request);
    if (maybeData.isErr()) {
      throw maybeData.unwrapErr();
    }

    const input = RegisterInput.parse(maybeData.unwrap());

    const { username, email, password } = input;
    const user = await this.userService.register(username, email, password);

    return this.toUserResponse(user);
  }

  async changeRole(currentUser: User, request: unknown): Promise<UserResponse> {
    if (!currentUser.permissions.canChangeUserRole()) {
      throw new Unauthorized();
    }

    const input = UpdateRoleInput.parse(request);

    const user = await this.userService.updateRole(
      input.id,
      input.new_role as RoleName,
    );

    return this.toUserResponse(user);
  }

  async changePassword(
    currentUser: User,
    request: unknown,
  ): Promise<UserResponse> {
    const input = z.object({
      currentPassword: z.string(),
      newPassword: z.string(),
    }).parse(request);

    const user = await this.userService.updatePassword(
      currentUser.id,
      input.newPassword,
    );

    return this.toUserResponse(user);
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email.toString(),
      role: user.role.toString(),
      created_at: user.createdAt.toUnix(),
      updated_at: user.updatedAt.toUnix(),
    };
  }
}
