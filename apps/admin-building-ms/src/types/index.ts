import { Request } from "express";

interface UserCtx {
  email: string;
  name: string;
  roleId: string;
  userName: string;
  id?: string;
}
interface RequestWithUser extends Request {
  // TODO: Need to remove this any and replace with actual type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  user: UserCtx; // or the actual type of your user
}

/**
 * Interface for pagination query parameters.
 */
interface PaginationQuery {
  page: number;
  limit: number;
}

export { RequestWithUser, PaginationQuery };
