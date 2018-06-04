import User from '../models/user';

export default {
  Query: {
    getUsers: async () => {
      const cats = await User.find();
      return cats;
    },
    getUserById: async (parent, args) => {
      try {
        const user = await User.findOne(args);
        return user;
      } catch (error) {
        return error;
      }
    },
  },
};
