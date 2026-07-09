import type { FindByEmailResponse, RefreshTokenUserResponse, RegisterInput, RegisterResponse, getUserProfileResponse } from "../types/authTypes.js";

export interface AuthRepository {
  createUser(user: RegisterInput): Promise<RegisterResponse>;
  findByEmail(email:string):Promise<FindByEmailResponse|null>;
  findById(id:number):Promise<getUserProfileResponse| null>
  findByIdWithRefreshToken(id:number):Promise<RefreshTokenUserResponse | null>
  updateRefreshToken(userId: number, refreshToken: string): Promise<void>

}

