import moment from 'moment-timezone';
import jwt from 'jwt-simple';
import User from '../models/user';
import { JWT_SECRET } from '../utils/dotenv';


const createToken = (userId) => {
  const token = jwt.encode(userId, JWT_SECRET, 'HS256', {
    iat: moment().unix(),
    exp: moment().add(1, 'hours').unix(),
  });
  return token;
};

export default {
  Mutation: {
    register: async (parent, args) => {
      try {
        let user = new User(args);
        user = await user.save();
        const token = createToken(user.id);
        return { token, user };
      } catch (error) {
        return error;
      }
    },
    login: async (parent, args) => {
      const { password, email } = args;
      try {
        const user = await User.findOne({ email }).select('+password').exec();
        if (await user.comparePasswords(password)) {
          const token = createToken(user.id);
          return { token, user };
        }
        return new Error('Passwords did not match.');
      } catch (error) {
        return error;
      }
    },
  },
};
