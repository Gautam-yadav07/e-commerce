import type { CreateSellerProfileInput, SellerProfileResponse } from "../types/seller.types.js";

export interface SellerRepository{
  createSellerProfile(seller:CreateSellerProfileInput):Promise<SellerProfileResponse>

  findSellerProfileByUserId(userId:number):Promise<SellerProfileResponse|null>;
}





