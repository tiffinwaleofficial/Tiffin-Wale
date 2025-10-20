import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Custom decorator to extract the current authenticated user from the request.
 * Optionally can extract a specific property from the user object.
 *
 * @example
 * // Get the entire user object
 * @GetCurrentUser() user: User
 *
 * @example
 * // Get a specific property from the user
 * @GetCurrentUser('_id') userId: string
 */
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Return the whole user if data is not specified
    if (!data) return user;

    // Return the specified property if it exists
    return user && user[data] ? user[data] : null;
  },
);
