import userResolvers from './user';

/**
 * The resolvers array needs to be in the exact same order
 * as its typeDefs counterpart in '../schemas/index.js'.
 */
const resolvers = [
  userResolvers,
];

export default resolvers;
