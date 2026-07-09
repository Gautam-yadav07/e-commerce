import prisma from "../config/prisma.js";
import type { AuthRepository } from "../repositories/auth.repository.js";
import type { FindByEmailResponse, RefreshTokenUserResponse, RegisterInput, RegisterResponse, getUserProfileResponse } from "../types/authTypes.js";


export class PrismaAuthRepository implements AuthRepository {
  async createUser(user:RegisterInput):Promise<RegisterResponse>{
    const newUser = await prisma.user.create({
      data:{
        name: user.name,
        email: user.email,
        password: user.hashedPassword,
        phone_number: user.phone_number,
        gender: user.gender,
        role_id: 1,

      },
      include:{
        role_name:true
      }
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

  
}
