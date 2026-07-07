import prisma from "../config/prisma.js";
import { PrismaUserRepository } from "../implements/user.prismaRepository.js";


interface CreateUser {
  email: string;
  name: string;
}


// export const userRegisterService = async (data: CreateUser)=>{
//   return await prisma.user.create({
//     data: {
//       email: data.email,
//       name: data.name,
//     },
//   });
// };



export const userRegisterService = async (data: CreateUser)=>{
  const userRepository = new PrismaUserRepository()
  const newUser = await userRepository.createUser(data)
  return newUser;
};
