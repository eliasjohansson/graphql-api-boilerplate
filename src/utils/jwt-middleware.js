import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './dotenv';
import User from '../models/user';

const jwtMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const splitToken = authorization.split(' ');
      const payload = await jwt.verify(splitToken[1], JWT_SECRET);
      if (payload) {
        const user = await User.findById(payload.id).exec();
        if (user) {
          req.user = user;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  next();
};
export default jwtMiddleware;
