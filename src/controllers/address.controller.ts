import type { NextFunction, Request, Response } from "express";
import { createAddressService, deleteAddressService, getAddressByIdService, getAddressByUserIdService, updateAddressService } from "../services/address.service.js";
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

export const getAddressByIdController = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const addressId = Number(req.params.addressId);
        const address = await getAddressByIdService(addressId);
        return handleSuccessResponse(res, 200, 'Address Fetched Succesfully', address);

    } catch (error) {
        next(error)
    }
}


export const updateAddressController = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const addressId = Number(req.params.addressId);

        const updatedAddress = await updateAddressService(addressId, req.body)
        return handleSuccessResponse(res, 200, "Address updated successfully", updatedAddress)
    } catch (error) {
        next(error)
    }
}

export const deleteAddressController = async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const addressId = Number(req.params.addressId);
        const userId = req.user.id;
        const deletedAddress = await deleteAddressService(userId, addressId);

        return handleSuccessResponse(res, 200, "Address deleted successfully", deletedAddress)
    } catch (error) {
        next(error)
    }
}