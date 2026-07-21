import { PrismaCartRepository } from "../implements/cart.prismaRepository.js";
import type { CartRepository } from "../repositories/cart.repository.js";



export class CartRepositoryFactory {
    private static repository = new PrismaCartRepository()

    static create():CartRepository{
        return this.repository
    }
}