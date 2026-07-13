import type { AddressResponse, CreateAddressInput, UpdateAddressInput } from "../types/address.types.js";

export interface AddressRepository {
    createAddress(address:CreateAddressInput):Promise<AddressResponse>;

    getAddressByUserId(userId:number):Promise<AddressResponse[]>

    getAddressById(addressId:number):Promise<AddressResponse | null>;
    
    updateAddress(addressId:number, address:UpdateAddressInput):Promise<AddressResponse>;
    
    deleteAddress(addressId:number):Promise<boolean>
}
