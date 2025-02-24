import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

const getCurrentUser = (context: ExecutionContext): any =>
  context.switchToHttp().getRequest<RequestWithUser>().user;
export const currentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): any => getCurrentUser(context),
);
