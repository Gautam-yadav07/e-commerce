import prisma from "../config/prisma.js";
import { UserRepositoryFactory } from "../factories/user.repository.factory.js";
import { PrismaUserRepository } from "../implements/user.prismaRepository.js";
import type { CreateUser } from "../types/authTypes.js";

const userRepository = UserRepositoryFactory.create()

export const userRegisterService = async (data: CreateUser)=>{
  
  const newUser = await userRepository.createUser(data)
  return newUser;
};
