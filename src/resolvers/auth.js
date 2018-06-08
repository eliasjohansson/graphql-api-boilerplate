import { ACCESS_SECRET, REFRESH_SECRET } from '../utils/dotenv';
import { isNotAuthenticated } from '../utils/permissions';
import { createTokens } from '../utils/auth';


// RESOLVERS
const register = isNotAuthenticated.createResolver(async (parent, args, { models }) => {
  let user;
  console.log(args);
  try {
    user = new models.User(args);
    user = await user.save();
  } catch (error) {
    return new Error(error);
  }

  const refreshTokenSecret = user.password + REFRESH_SECRET;
  const [accessToken, refreshToken] = await createTokens(
    user.id,
    ACCESS_SECRET,
    refreshTokenSecret,
  );
  delete user.password;
  return {
    accessToken,
    refreshToken,
    user,
  };
});


const login = isNotAuthenticated.createResolver(async (parent, args, { models }) => {
  const { password, email } = args;
  let user;
  try {
    user = await models.User.findOne({ email }).select('+password').exec();
    const validPassword = await user.comparePasswords(password);
    if (!validPassword) {
      return new Error('Passwords did not match');
    }
  } catch (error) {
    return new Error('No user with that email was found');
  }

  const refreshTokenSecret = user.password + REFRESH_SECRET;
  const [accessToken, refreshToken] = await createTokens(
    user.id,
    ACCESS_SECRET,
    refreshTokenSecret,
  );
  delete user.password;
  return {
    accessToken,
    refreshToken,
    user,
  };
});

export default {
  Mutation: {
    register,
    login,
  },
};
