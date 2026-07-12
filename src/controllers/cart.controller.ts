import type { NextFunction,Request,Response } from "express";
import { addItemToCartService, getCartService, getOrCreateUserCartService, removeItemFromCartService, updateItemQuantityService } from "../services/cart.service.js";
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

export const addItemToCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
  
    const { product_id, quantity } = req.body;

    const item = await addItemToCartService(userId, product_id, quantity);

    return handleSuccessResponse(res, 201, "Item added in cart successfully",item)

  } catch (error) {
    next(error);
  }
};

export const updateItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const itemId = Number(req.params.itemId);

    const { quantity } = req.body;

    const item = await updateItemQuantityService(userId, itemId, quantity);

    handleSuccessResponse(res, 200, "Item quantity updated", item)

  } catch (error) {
    next(error);
  }
};

export const removeItemFromCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
   
    const itemId = Number(req.params.itemId)

   const removedItem =  await removeItemFromCartService(userId, itemId);

   handleSuccessResponse(res, 200, "Item removed from cart", removedItem)

  } catch (error) {
    next(error);
  }
};