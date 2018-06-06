import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JWT_SECRET } from '../utils/dotenv';
import { isNotAuthenticated } from '../utils/permissions';

// HELPERS
const createToken = async (userId) => {
  const token = await jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
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
      const token = await createToken(user.id);
      console.log(`TOKEN: ${token}`);
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
