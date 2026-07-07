
import prisma from "../config/prisma.js";
import type{ UserRepository,UserInput, UserCreatedResponse } from "../repositories/user.repository.js";

export class PrismaUserRepository implements UserRepository {
  async createUser(user:UserInput):Promise<UserCreatedResponse>{
    const newUser = await prisma.user.create({
      data:{
        name:user.name,
        email:user.email
      }
    });

    return {
    id: newUser.id,
    name:newUser.name,
    email:newUser.email,
    created_at:newUser.createdAt
  }
  }
  
}
