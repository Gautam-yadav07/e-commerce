import prisma from "../config/prisma.js";
import type { UserRole } from "../generated/prisma/enums.js";
import type { AuthRepository } from "../repositories/auth.repository.js";
import type { FindByEmailResponse, FindByPhoneNumberResponse, RefreshTokenUserResponse, RegisterInput, RegisterResponse, RoleResponse, findByResetPasswordTokenResponse, getUserProfileResponse } from "../types/authTypes.js";


export class PrismaAuthRepository implements AuthRepository {
  async createUser(user:RegisterInput):Promise<RegisterResponse>{

   const role = await prisma.role.upsert({
      where: { role_name: "CUSTOMER" },
      update: {},
      create: { role_name: "CUSTOMER" },
    });

    const newUser = await prisma.user.create({

      data: {
        name: user.name,
        email: user.email,
        password: user.hashedPassword,
        phone_number: user.phone_number,
        gender: user.gender,
        role_id: role.id,
      },
      include: {
        role_name: true,
      },

    });
  
    return {
    id: newUser.id,
    name:newUser.name,
    email:newUser.email,
    gender:newUser.gender,
    phone_number:newUser.phone_number,
    role_name:newUser.role_name.role_name,
    created_at:newUser.created_at
  }
 
  }



  async findByEmail(email: string): Promise<FindByEmailResponse|null> {
    const user = await prisma.user.findUnique({
      where:{
        email
      },
      include:{role_name:true}
    });

    if(!user){
      return null
    }

    return {
      id:user.id,
      name:user.name,
      email:user.email,
      phone_number:user.phone_number,
      role_name:user.role_name.role_name,
      gender:user.gender,
      role_id:user.role_id,
      password:user.password,
      updated_at:user.updated_at,
      created_at:user.created_at
    }
    
    
  }
  async findById(id: number): Promise<getUserProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where:{id},
      include:{role_name:true}
    })

    if(!user){
      return null
    }
    return{
      id:user.id,
      name:user.name,
      email:user.email,
      gender:user.gender,
      phone_number:user.phone_number,
      role_name:user.role_name.role_name,
      
    }
  }

  async findByIdWithRefreshToken(id: number): Promise<RefreshTokenUserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role_name: true }
    })

    if(!user){
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role_name: user.role_name.role_name,
      refresh_token: user.refresh_token,
    }
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    
  const updatedToken = await prisma.user.update({
    where: { id: userId },
    data: { refresh_token: refreshToken }
  })
}
async updateUserRole(userId: number, roleId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        role_id: roleId,
        updated_at: new Date(),
      },
    });
  }



async getRoleByName(role_name: UserRole): Promise<RoleResponse | null> {
    const role = await prisma.role.findUnique({
      where:{role_name:role_name}
    })
    if(!role){
      return null
    }

    return{
      role_id:role.id,
      role_name:role.role_name
    }
  }


  async findByPhoneNumber(phone_number: string): Promise<FindByPhoneNumberResponse | null> {
    const user = await prisma.user.findUnique({
      where:{phone_number:phone_number},
      include:{role_name:true}
    })
    if(!user){
      return null
    }

     return {
      id:user.id,
      name:user.name,
      email:user.email,
      phone_number:user.phone_number,
      role_name:user.role_name.role_name,
      gender:user.gender,
      role_id:user.role_id,
      password:user.password,
      updated_at:user.updated_at,
      created_at:user.created_at
    }

  }

  async logoutUser(userId: number): Promise<void> {
    const logout  = await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        refresh_token:null
      }
    })
  }

async saveResetPasswordToken(userId: number, token: string, expiry: Date): Promise<void> {
  const updateResetToken = await prisma.user.update({
    where:{id:userId},
    data:{
      reset_password_token:token,
      reset_password_expiry:expiry,
    }
  })
}

async findByResetPasswordToken(token: string): Promise<findByResetPasswordTokenResponse|null> {
  
  const user = await prisma.user.findFirst({
    where:{
      reset_password_token:token
    }
  })
  if(!user){
    return null
  }
  return{
    id:user?.id,
    email:user?.email,
    reset_password_expiry:user.reset_password_expiry,
    reset_password_token:user.reset_password_token||'',
    password:user.password,
    created_at:user.created_at,
    updated_at:user.updated_at
  }
}

async updatePassword(userId: number, hashedPassword: string): Promise<void> {
  const password = await prisma.user.update({
    where:{id:userId},
    data:{
      password:hashedPassword,
      refresh_token:null,
      reset_password_token:null,
      reset_password_expiry:null
    }
  })
}

  
}
