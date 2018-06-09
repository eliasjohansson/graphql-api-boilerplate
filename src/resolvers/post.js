import { isAuthenticated } from '../utils/permissions';
import { UnauthorizedError, NotFoundError } from '../utils/errors';

const authRequired = isAuthenticated.createResolver;

// Queries
const getPosts = authRequired((parent, args, { models }) => models.Post.find());
const getPostById = authRequired((parent, args, { models }) => models.Post.findOne(args));

// Mutations
const createPost = authRequired((parent, args, { models, user }) => {
  const post = new models.Post({
    text: args.text,
    author: user,
  });
  return post.save();
});

const updatePost = authRequired(async (parent, args, { models, user }) => {
  const post = await models.Post.findOne({ _id: args._id });
  if (!post) {
    return new NotFoundError();
  }
  if (post.author.toString() === user) {
    post.set({ text: args.text });
    return post.save();
  }
  return new UnauthorizedError();
});

const deletePost = authRequired(async (parent, args, { models, user }) => {
  const post = await models.Post.findOne({ _id: args._id });
  if (!post) {
    return new NotFoundError();
  }
  if (post.author.toString() === user) {
    return post.remove();
  }
  return new UnauthorizedError();
});

export default {
  Query: {
    getPosts,
    getPostById,
  },
  Mutation: {
    createPost,
    updatePost,
    deletePost,
  },
};
