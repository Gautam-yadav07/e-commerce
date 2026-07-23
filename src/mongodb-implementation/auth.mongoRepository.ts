import { getNextId } from "../models/counter.model.js";
import { RoleModel } from "../models/role.model.js";
import { UserModel } from "../models/user.model.js";
import type { AuthRepository } from "../repositories/auth.repository.js";
import type { FindByEmailResponse, FindByPhoneNumberResponse, findByResetPasswordTokenResponse, getUserProfileResponse, RefreshTokenUserResponse, RegisterInput, RegisterResponse, RoleResponse } from "../types/authTypes.js";



export class AuthMongoRepository implements AuthRepository{
  async createUser(user: RegisterInput): Promise<RegisterResponse> {

    let role = await RoleModel.findOne({role_name:"CUSTOMER"})

    if(!role){
      const roleId = await getNextId("role");
      role = await RoleModel.create({id:roleId, role_name:"CUSTOMER"})
    }

    const userId = await getNextId('user')

    const newUser = await UserModel.create({
        id:userId,
        name:user.name,
        email:user.email,
        password:user.hashedPassword,
        gender:user.gender,
        phone_number:user.phone_number
    });
    return {
      id:newUser.id,
    name:newUser.name,
    email:newUser.email,
    gender:newUser.gender as any,
    phone_number:newUser.phone_number,
    role_name:role.role_name,
    created_at:newUser.createdAt
  }
  }
   async findByEmail(email: string): Promise<FindByEmailResponse | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role_name: role?.role_name || "CUSTOMER",
      gender:user.gender as any,
      role_id:user.role_id as any,
      password: user.password,
      updated_at: user.updatedAt,
      created_at: user.createdAt,
    };
  }

  async findById(id: number): Promise<getUserProfileResponse | null> {
    const user = await UserModel.findOne({ id });
    if (!user) return null;

    

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender as any,
      phone_number: user.phone_number,
      role_name: role?.role_name || "CUSTOMER",
    };
  }

  async findByIdWithRefreshToken(
    id: number
  ): Promise<RefreshTokenUserResponse | null> {
    const user = await UserModel.findOne({ id });
    if (!user) return null;

    const role = await RoleModel.findOne({ id: user.role_id });

    return {
      id: user.id,
      email: user.email,
      role_name: role?.role_name || "CUSTOMER",
      refresh_token: user.refresh_token||'',
    };
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await UserModel.updateOne(
      { id: userId },
      { refresh_token: refreshToken }
    );
  }

  async updateUserRole(userId: number, roleId: number): Promise<void> {
    await UserModel.updateOne({ id: userId }, { role_id: roleId });
  }

 
  async logoutUser(userId: number): Promise<void> {
    await UserModel.updateOne({ id: userId }, { refresh_token: null });
  }

  async saveResetPasswordToken(
    userId: number,
    token: string,
    expiry: Date
  ): Promise<void> {
    await UserModel.updateOne(
      { id: userId },
      { reset_password_token: token, reset_password_expiry: expiry }
    );
  }

  async updatePassword(
    userId: number,
    hashedPassword: string
  ): Promise<void> {
    await UserModel.updateOne(
      { id: userId },
      {
        password: hashedPassword,
        refresh_token: null,
        reset_password_token: null,
        reset_password_expiry: null,
      }
    );
  }
  
}