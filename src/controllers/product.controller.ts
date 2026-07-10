import type { NextFunction, Request, Response} from "express";
import { createProductService } from "../services/product.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";




export const createProductController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const id = req.user.id
    const data = {seller_id:id,...req.body,}

    const newProduct = await createProductService(data)
    return handleSuccessResponse(res, 201, "Product Added Succesfully",newProduct)

  } catch (error) {
    next(error)
    
  }
}