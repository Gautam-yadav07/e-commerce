import prisma from "../config/prisma.js";


interface CreateUser {
  email: string;
  name: string;
}


export const userRegisterService = async (data: CreateUser)=>{
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
};

