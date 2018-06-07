import { isAuthenticated } from '../utils/permissions';
import { DetailedNotFoundError } from '../utils/errors';

// RESOLVERS
const getUsers = isAuthenticated.createResolver(async (parent, args, { models }) => {
  const cats = await models.User.find();
  return cats;
});

const getUserById = isAuthenticated.createResolver(async (parent, args, { models }) => {
  try {
    const user = await models.User.findOne(args);
    return user;
  } catch (error) {
    throw DetailedNotFoundError('User', args);
  }
});

export default {
  Query: {
    getUsers,
    getUserById,
  },
};
