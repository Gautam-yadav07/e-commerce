import type { NextFunction, Request, Response } from "express";
import { createAddressService, getAddressByUserIdService } from "../services/address.service.js";
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


export const getAddressesByUserIdController = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const userId = req.user.id;
        const addresses = await getAddressByUserIdService(userId);
        return handleSuccessResponse(res, 200, "All address of a user", addresses)
    } catch (error) {
        next(error)
    }
}