import { isAuthenticated } from '../utils/permissions';
import { DetailedNotFoundError } from '../utils/errors';
import User from '../models/user';

// RESOLVERS
const getUsers = isAuthenticated.createResolver(async () => {
  const cats = await User.find();
  return cats;
});

const getUserById = isAuthenticated.createResolver(async (parent, args) => {
  try {
    const user = await User.findOne(args);
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
