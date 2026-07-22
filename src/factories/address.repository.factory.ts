import { PrismaAddressRepository } from "../implements/address.prismaRepository.js";
import type { AddressRepository } from "../repositories/address.repository.js";


export class AddressRepositoryFactory {
    private static repository = new PrismaAddressRepository();

    static create():AddressRepository{
        return this.repository;
    }
}