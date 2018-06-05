import moment from 'moment-timezone';
import jwt from 'jwt-simple';
import User from '../models/user';
import { JWT_SECRET } from '../utils/dotenv';
import { isNotAuthenticated } from '../utils/permissions';

// HELPERS
const createToken = (userId) => {
  const token = jwt.encode(userId, JWT_SECRET, 'HS256', {
    iat: moment().unix(),
    exp: moment().add(1, 'hours').unix(),
  });
  return token;
};

// RESOLVERS
const register = isNotAuthenticated.createResolver(async (parent, args) => {
  try {
    let user = new User(args);
    user = await user.save();
    const token = createToken(user.id);
    return { token, user };
  } catch (error) {
    return new Error('You need to fill all the required fields');
  }
});

const login = isNotAuthenticated.createResolver(async (parent, args) => {
  const { password, email } = args;
  try {
    const user = await User.findOne({ email }).select('+password').exec();
    if (await user.comparePasswords(password)) {
      const token = createToken(user.id);
      return { token, user };
    }
    return new Error('Passwords did not match');
  } catch (error) {
    return new Error('No user with that email was found');
  }
});

export default {
  Mutation: {
    register,
    login,
  },
};
