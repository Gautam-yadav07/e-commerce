import type { AddressResponse, CreateAddressInput } from "../types/address.types.js";

export interface AddressRepository {
    createAddress(address:CreateAddressInput):Promise<AddressResponse>;
    
}