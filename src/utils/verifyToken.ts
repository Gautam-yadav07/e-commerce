import jwt, {type JwtPayload } from 'jsonwebtoken';
import type { AuthenticatedUser } from '../types/authTypes.js';
import { AppError } from './appError.js';



const JWT_SECRET = process.env.JWT_SECRET ;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not configured");
}

export const verifyToken = (token: string)=> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as AuthenticatedUser;

    return decoded;

  } catch (error:any) {
    throw new AppError(500,"Internal server error",error.message)
  }
};
