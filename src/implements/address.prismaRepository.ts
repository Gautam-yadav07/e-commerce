import prisma from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { AddressRepository } from "../repositories/address.repository.js";
import type { CreateAddressInput, AddressResponse, UpdateAddressInput } from "../types/address.types.js";



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

    async getAddressByUserId(userId: number): Promise<AddressResponse[]> {
        const addresses = await prisma.addresses.findMany({
            where:{
                user_id:userId
            },
            // include:{
            //     user:true
            // }
            orderBy:{
                created_at:'desc'
            }
        })

        return addresses.map((address)=>({
            id:address.id,
            user_id:address.user_id,
            address_line:address.address_line,
            city:address.city,
            state:address.state,
            country:address.country,
            pin_code:address.pin_code,
            created_at:address.created_at,
            updated_at:address.updated_at,

        }))
    }


    async getAddressById(addressId: number): Promise<AddressResponse | null> {
        const address = await prisma.addresses.findUnique({
            where:{id:addressId}
        })
        if(!address){
            return null;
        }

        return {
            id:address.id,
            user_id:address.user_id,
            address_line:address.address_line,
            city:address.city,
            state:address.state,
            country:address.country,
            pin_code:address.pin_code,
            created_at:address.created_at,
            updated_at:address.updated_at, 
        }

    }

    async updateAddress(addressId: number, address: UpdateAddressInput): Promise<AddressResponse> {
        const data: Prisma.AddressesUpdateInput = {}

        const fields = ["address_line", "city", "pin_code", "state", "country"] as const;

        for(let field of fields){
            if(address[field] !== undefined){
                data[field] = address[field]
            }
        }

        const updatedAddress = await prisma.addresses.update({
            where:{id:addressId},
            data
        })
        return {
            id:updatedAddress.id,
            user_id:updatedAddress.user_id,
            address_line:updatedAddress.address_line,
            city:updatedAddress.city,
            state:updatedAddress.state,
            country:updatedAddress.country,
            pin_code:updatedAddress.pin_code,
            updated_at:updatedAddress.updated_at,
            created_at:updatedAddress.created_at
        }
    }


    async deleteAddress(addressId: number): Promise<boolean> {
        console.log(addressId)
        const deletedAddress = await prisma.addresses.delete({
            where:{id:addressId}
        });
        return true
    }
}