import { isAuthenticated } from '../utils/permissions';

const authRequired = isAuthenticated.createResolver;

// Queries
const getUsers = authRequired((parent, args, { models }) => models.User.find());
const getUserById = authRequired((parent, args, { models }) => models.User.findOne(args));

// Mutations
const updateUser = authRequired(async (parent, args, { models, user }) => {
  const userToUpdate = await models.User.findOne({ _id: user });
  userToUpdate.set({
    username: args.username,
  });
  return userToUpdate.save();
});
const deleteUser = authRequired(async (parent, args, { models, user }) => {
  const userToDelete = await models.User.findOne({ _id: user });
  return userToDelete.remove();
});

export default {
  Query: {
    getUsers,
    getUserById,
  },
  Mutation: {
    updateUser,
    deleteUser,
  },
};
