import { UserRepositoryFactory } from "../factories/auth.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import type { CreateSellerProfileInput } from "../types/seller.types.js";

import { AppError } from "../utils/appError.js";



const sellerRepository = SellerRepositoryFactory.create()
// const userRepository = UserRepositoryFactory.create()


export const createSellerProfileService = async(data:CreateSellerProfileInput)=>{
  const {shop_name,ifsc_code,gst_number,bank_account_number, user_id} = data;

  const existingSeller = await sellerRepository.findSellerProfileByUserId(user_id)

  if(existingSeller){
    throw new AppError(409, "Seller Profile already exist")
  }

  const profile = await sellerRepository.createSellerProfile(data);


  return profile

   
}