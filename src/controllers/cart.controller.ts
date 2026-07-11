import type { NextFunction,Request,Response } from "express";
import { getCartService, getOrCreateUserCartService } from "../services/cart.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";


export const getCartController = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const userId = req.user.id;
        const cartItems = await getCartService(userId)
        return handleSuccessResponse(res, 200, "Cart Items fetched successfully", cartItems)
    } catch (error) {
        next(error)
    }
}