import jwt from 'jwt-simple';
import { JWT_SECRET } from './dotenv';
import User from '../models/user';

function extractTokenPayload(token) {
  const splitToken = token.split(' ');
  const payload = jwt.decode(splitToken[1], JWT_SECRET);
  return payload;
}

const jwtMiddleware = async (req, res, next) => {
  if (req.headers.authorization) {
    const userId = extractTokenPayload(req.headers.authorization);
    const user = await User.findById(userId).exec();
    if (user) {
      req.user = user;
    }
  }
  next();
};

export default jwtMiddleware;
