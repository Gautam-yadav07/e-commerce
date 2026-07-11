import type { NextFunction, Request, Response} from "express";
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, updateProductService } from "../services/product.service.js";
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
    const id = Number(req.params.productId);

    const product = await getProductByIdService(id);

    return handleSuccessResponse(res,200, "Product details fetched successfully", product)
  } catch (error) {
    next(error)
  }
}


export const updateProductController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const sellerUserId = req.user.id;
    const productId = Number(req.params.productId);

    const updatedProduct = await updateProductService(sellerUserId,productId, req.body);

    return handleSuccessResponse(res, 200, "Product Updated Successfully", updatedProduct)
  } catch (error) {
    next(error)
  }
}


export const deleteProductController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const sellerId = req.user.id;

    const productId = Number(req.params.productId);
    const deletedProduct = await deleteProductService(sellerId, productId);
    handleSuccessResponse(res,200, "Product deleted successfully", deletedProduct);
  } catch (error) {
    next(error)
  }
}