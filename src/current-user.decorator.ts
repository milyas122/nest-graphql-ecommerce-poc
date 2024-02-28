import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context).getContext();
    return gqlCtx.req.user;
  },
);
