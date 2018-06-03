import User from '../models/user';

export default {
  Query: {
    Users: async () => {
      const cats = await User.find();
      return cats;
    },
    User: async (parent, args) => {
      console.log(args);
      const user = await User.findOne(args);
      return user;
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = new User(args).save();
      return user;
    },
  },
};
