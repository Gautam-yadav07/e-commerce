import { AuthRepositoryFactory } from "../factories/auth.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import { UserRole } from "../generated/prisma/enums.js";
import type { CreateSellerProfileInput } from "../types/seller.types.js";

import { AppError } from "../utils/appError.js";



const sellerRepository = SellerRepositoryFactory.create()
const userRepository = AuthRepositoryFactory.create()


export const createSellerProfileService = async(data:CreateSellerProfileInput)=>{
  const {shop_name,ifsc_code,gst_number,bank_account_number, user_id} = data;

  console.log(data )

  const existingSeller = await sellerRepository.findSellerProfileByUserId(user_id)

  const role = await userRepository.getRoleByName(UserRole.SELLER)
  if(!role){
    throw new AppError(404, "User role is not found")
  }
  console.log(role)

  if(existingSeller){
    throw new AppError(409, "Seller Profile already exist")
  }

  const profile = await sellerRepository.createSellerProfile(data);

  const updateRole = await userRepository.updateUserRole(data.user_id, role.role_id)


  return profile;

   
}