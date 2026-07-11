import type { NextFunction, Request, Response} from "express";
import { createProductService, getAllProductsService, getProductByIdService } from "../services/product.service.js";
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


export const getAllProductsController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const products = await getAllProductsService();
    return handleSuccessResponse(res,200, "All products fetched successfully", products)
  } catch (error) {
    next(error)
  }
}

export const getProductByIdController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const id = Number(req.params.id);

    const product = await getProductByIdService(id);

    return handleSuccessResponse(res,200, "Product details fetched successfully", product)
  } catch (error) {
    next(error)
  }
}