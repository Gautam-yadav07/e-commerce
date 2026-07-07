import jwt, {type JwtPayload } from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware.js';
import type { AuthenticatedUser } from '../types/authTypes.js';



const SECRET_KEY = process.env.JWT_SECRET ;

export const verifyToken = (token: string)=> {
  try {
    const decoded = jwt.verify(token, SECRET_KEY as string) as AuthenticatedUser;
    return decoded;
  } catch (error:any) {
    throw new AppError(500,"Internal server error",error.message)
  }
};
