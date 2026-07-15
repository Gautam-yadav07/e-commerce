import { PrismaPaymentRepository } from "../implements/payment.prismaRepository.js";
import type { PaymentRepository } from "../repositories/payment.repository.js";





export class PaymentRepositoryFactory {
    private static repository = new PrismaPaymentRepository();

    static create(): PaymentRepository{
        return this.repository
    }
}