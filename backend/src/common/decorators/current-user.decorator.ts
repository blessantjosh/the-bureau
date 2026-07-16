import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extracts the authenticated user object from the incoming request.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: UserEntity) { ... }
 *
 * An optional property key can be provided to pick a specific field:
 *   @CurrentUser('id') userId: string
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<Request & { user: Record<string, unknown> }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
