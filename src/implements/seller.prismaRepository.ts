import prisma from "../config/prisma.js";
import type { SellerRepository } from "../repositories/seller.repository.js";
import type { CreateSellerProfileInput, SellerProfileResponse } from "../types/seller.types.js";

export class PrismaSellerRepository implements SellerRepository{
  async createSellerProfile(seller: CreateSellerProfileInput): Promise<SellerProfileResponse> {
   const newSeller = await prisma.seller_Profiles.create({
    data:{
      user_id:seller.user_id,
      shop_name:seller.shop_name,
      gst_number:seller.gst_number,
      ifsc_code:seller.ifsc_code,
      bank_account_number:seller.bank_account_number
    }
   })

   return {
    id:newSeller.id,
    user_id:newSeller.user_id,
    shop_name:newSeller.shop_name,
    gst_number:newSeller.gst_number,
    bank_account_number:newSeller.bank_account_number,
    ifsc_code:newSeller.ifsc_code,
    updated_at:newSeller.updated_at,
    created_at:newSeller.created_at
   }
  }


  async findSellerProfileByUserId(userId: number): Promise<SellerProfileResponse|null> {
    const seller = await prisma.seller_Profiles.findFirst({
      where:{user_id:userId},
      include:{
        user:true
      }
    })
    if(!seller){
      return null
    }

    return {
      id: seller.id,
      user_id:seller.user_id,
      shop_name:seller.shop_name,
      gst_number:seller.gst_number,
      ifsc_code:seller.ifsc_code,
      bank_account_number:seller.bank_account_number,
      created_at:seller.created_at,
      updated_at:seller.updated_at

    }
  }
}