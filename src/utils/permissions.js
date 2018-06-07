import { createResolver } from 'apollo-resolvers';
import { isInstance } from 'apollo-errors';
import {
  UnkownError,
  UnauthorizedError,
  AlreadyAuthenticatedError,
} from './errors';


const baseResolver = createResolver(
  null,
  (parent, args, ctx, err) => {
    if (isInstance(err)) {
      return err;
    }
    return new UnkownError({
      data: {
        name: err.name,
        details: err.message,
      },
    });
  },
);

export const isAuthenticated = baseResolver.createResolver((parent, args, ctx) => {
  const { user } = ctx;
  if (!user) throw new UnauthorizedError();
});

export const isNotAuthenticated = baseResolver.createResolver((parent, args, ctx) => {
  const { user } = ctx;
  if (user) throw new AlreadyAuthenticatedError();
});

