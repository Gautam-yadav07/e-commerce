import type { FindByEmailResponse, FindByPhoneNumberResponse, RefreshTokenUserResponse, RegisterInput, RegisterResponse, RoleResponse, getUserProfileResponse } from "../types/authTypes.js";

export interface AuthRepository {
  createUser(user: RegisterInput): Promise<RegisterResponse>;
  findByEmail(email:string):Promise<FindByEmailResponse|null>;
  findById(id:number):Promise<getUserProfileResponse| null>
  findByIdWithRefreshToken(id:number):Promise<RefreshTokenUserResponse | null>
  updateRefreshToken(userId: number, refreshToken: string): Promise<void>

  updateUserRole(userId:number,roleId:number):Promise<void>

  getRoleByName(role_name:string):Promise<RoleResponse|null>

  findByPhoneNumber(number:string):Promise<FindByPhoneNumberResponse | null>

}

