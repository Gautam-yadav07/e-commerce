import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser; 
    }
  }
}

export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SELLER = "seller",
}


export interface CreateUser {
  email: string;
  name: string;
}


export interface UserCreatedResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

 export interface UserInput {
  name: string;
  email: string;
}
