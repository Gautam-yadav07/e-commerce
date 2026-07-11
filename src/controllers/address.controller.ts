import type { NextFunction, Request, Response } from "express";
import { createAddressService } from "../services/address.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";



export const createAddressController= async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const user_id = req.user.id;
        const data = {user_id,...req.body}

        const newAddress = await createAddressService(data);
        return handleSuccessResponse(res, 201, "Address created Successfully", newAddress)
        
    } catch (error) {
        next(error)
    }
}