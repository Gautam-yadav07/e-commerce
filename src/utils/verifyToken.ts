import jwt, {type JwtPayload } from 'jsonwebtoken';
import type { AuthenticatedUser } from '../types/authTypes.js';
import { AppError } from './appError.js';



const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY environment variable is not configured");
}

export const verifyToken = (token: string)=> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as AuthenticatedUser;

    return decoded;

  } catch (error) {
    throw new AppError(401,"Invalid or expired token")
  }
};
