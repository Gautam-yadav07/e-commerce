import { AddressRepositoryFactory } from "../factories/address.repository.factory.js";
import { AuthRepositoryFactory } from "../factories/auth.repository.factory.js";
import type { CreateAddressInput } from "../types/address.types.js";
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