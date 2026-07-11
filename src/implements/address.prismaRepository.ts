import prisma from "../config/prisma.js";
import type { AddressRepository } from "../repositories/address.repository.js";
import type { CreateAddressInput, AddressResponse } from "../types/address.types.js";



export class PrismaAddressRepository implements AddressRepository{
    async createAddress(data: CreateAddressInput): Promise<AddressResponse> {
        const address = await prisma.addresses.create({
            data:{
                user_id:data.user_id,
                address_line:data.address_line,
                city:data.city,
                country:data.country,
                state:data.state,
                pin_code: data.pin_code,
            }
        })

        return {
            id:address.id,
            user_id:address.user_id,
            address_line:address.address_line,
            city:address.city,
            state:address.state,
            pin_code:address.pin_code,
            country:address.country,
            created_at:address.created_at,
            updated_at:address.updated_at

        }
    }
}