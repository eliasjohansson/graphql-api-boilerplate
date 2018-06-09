import jwt from 'jsonwebtoken';
import { ACCESS_SECRET, REFRESH_SECRET } from './dotenv';
import User from '../models/user';

// Create new tokens with given userId and secrets
export const createTokens = (userId, secret1, secret2) => {
  const accessToken = jwt.sign({ user: userId }, secret1, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ user: userId }, secret2, { expiresIn: '7d' });
  return [accessToken, refreshToken];
};


export const refreshTokens = async (accessToken, refreshToken, SECRET, SECRET2) => {
  let userId = -1;
  try {
    // Get user id from the refresh token without verifying it
    // This way we can get the users password and create the refreshtoken secret
    const refreshTokenPayload = jwt.decode(refreshToken);
    userId = refreshTokenPayload.user;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  // Get user and include the password
  const user = await User.findOne({ _id: userId }).select('+password').exec();
  if (!user) {
    return {};
  }

  // Create refresh token secret so we can verify it, this is why we used decode earlier
  const refreshSecret = user.password + SECRET2;

  try {
    // Check if token is valid
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  // If refresh token is valid go ahead and create the new tokens
  const [newAccessToken, newRefreshToken] = await createTokens(user.id, SECRET, refreshSecret);
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user,
  };
};


// Adds authenticated User(id) to the req object which is then attached to the context
export const addUserToReq = async (req, res, next) => {
  // Check if Access Token is passed in headers
  const accessToken = req.headers['x-token'];
  if (accessToken) {
    try {
      // If the Access Token is still valid set req.user to its payload
      const payload = await jwt.verify(accessToken, ACCESS_SECRET);
      req.user = payload.user;
    } catch (err) {
      // If token is invalid get the Refresh Token and try to generate new ones
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        accessToken,
        refreshToken,
        ACCESS_SECRET,
        REFRESH_SECRET,
      );
      // If createTokens() successfully created new tokens add them to the response headers
      // These new tokens can easily be set in the clients storage by using a apollo-link afterware
      if (newTokens.accessToken && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.accessToken);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user.id;
    }
  }
  next();
};
