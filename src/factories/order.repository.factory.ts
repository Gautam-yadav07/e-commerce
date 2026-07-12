import { PrismaOrderRepository } from "../implements/order.prismaRepository.js";
import type { OrderRepository } from "../repositories/order.repository.js";




export class OrderRepositoryFactory {
    private static repository = new PrismaOrderRepository();

    static create(): OrderRepository{
        return this.repository
    }
}