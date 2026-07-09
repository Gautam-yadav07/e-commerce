import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser extends JwtPayload {
  id: number;
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
  password:string;
  // gender:string;
  phone_no:string;
  // role_id:number;

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
  password:string;
  phone_no:string;
}

enum Gender {
  MALE="male",
  FEMALE= 'female',
  OTHER = 'other'
}



export interface RegisterInput {
  name:string,
  email:string,
  hashedPassword:string,
  phone_number:string,
  gender: string,
  role_id?:number
}


export interface RegisterResponse{
  id:number,
  name:string,
  email:string,
  gender: string,
  phone_number:string,
  created_at:Date,
  // role_id:number
  role_name:string
}


export interface FindByEmailResponse{
  id: number;
  name: string;
  email: string;
  password: string;
  phone_number: string;
  gender: string | null;
  role_id: number;
  role_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface RefreshTokenUserResponse {
  id: number;
  email: string;
  role_name: string;
  refresh_token: string | null;
}


export interface getUserProfileResponse{
  id: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string | null;
  role_name: string;
}