import { isAuthenticated } from '../utils/permissions';

const authRequired = isAuthenticated.createResolver;

// RESOLVERS
const getUsers = authRequired((parent, args, { models }) => models.User.find());
const getUserById = authRequired((parent, args, { models }) => models.User.findOne(args));

export default {
  Query: {
    getUsers,
    getUserById,
  },
};
