import { AddressRepositoryFactory } from "../factories/address.repository.factory.js";
import { AuthRepositoryFactory } from "../factories/auth.repository.factory.js";
import type { CreateAddressInput, UpdateAddressInput } from "../types/address.types.js";
import { AppError } from "../utils/appError.js";


const addressRepository = AddressRepositoryFactory.create();
const authRepository = AuthRepositoryFactory.create()

export const createAddressService = async(data:CreateAddressInput)=>{
    const user = await authRepository.findById(data.user_id);
    if(!user){
        throw new AppError(404, "User not found")
    }

    const newAddress = await addressRepository.createAddress(data);
    return newAddress
}


export const getAddressByUserIdService = async(userId:number)=>{
    const user = await authRepository.findById(userId);

    if(!user){
        throw new AppError(404, "User not found")
    }

    const addresses = await addressRepository.getAddressByUserId(userId);
    return addresses
}


export const getAddressByIdService = async(addressId:number)=>{
    const address = await addressRepository.getAddressById(addressId);

    if(!address){
        throw new AppError(404, "Address Not found");
    }

    return address;

}

export const updateAddressService = async(addressId:number, data:UpdateAddressInput)=>{
    const address = await addressRepository.getAddressById(addressId);
    if(!address){
        throw new AppError(404, "Address not found")
    }
    const updatedAddress  = await addressRepository.updateAddress(addressId, data);
    return updatedAddress
}


export const deleteAddressService = async(userId:number,addressId:number)=>{

    const address = await addressRepository.getAddressById(addressId);

    if(!address){
        throw new AppError(404, "Address not found");
    }

    const user = await authRepository.findById(userId);

    if(address.user_id !== userId){
        throw new AppError(403, "You do not have permission to delete this address.")
    }

    const deleteAddress  = await addressRepository.deleteAddress(addressId);
    return deleteAddress
}