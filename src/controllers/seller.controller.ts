
import type {Request, NextFunction, Response } from "express";
import { createSellerProfileService } from "../services/seller.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";


export interface CreateSellerProfileInput{
  user_id:number,
  shop_name:string,
  gst_number:string,
  bank_account_number:string,
  ifsc_code:string,
}


export const createSellerProfileController = async(req:Request, res:Response, next:NextFunction)=>{
try {

  const userId = req.user.id;
  const data = {user_id: userId, ...req.body}
  const newSeller = await createSellerProfileService(data);

  return handleSuccessResponse(res, 201, "Seller Profile created successfully", newSeller)
  
} catch (error) {
  next(error)
}
}