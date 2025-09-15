import Uuid from "../value-objects/uuid.ts";

export class CommentDoesNotExist extends Error {
  override name = "CommentDoesNotExist";

  constructor(id: Uuid) {
    super(`Comment with id '${id.toString()}' does not exist`);
  }
}

export class NoPermissionToCreateComment extends Error {
  override name = "NoPermissionToCreateComment";

  constructor() {
    super("You are not allowed to comment on this post.");
  }
}
