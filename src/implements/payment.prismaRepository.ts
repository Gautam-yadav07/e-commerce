import prisma from "../config/prisma.js";
import { PaymentStatus, type Prisma } from "../generated/prisma/client.js";
import type { PaymentRepository } from "../repositories/payment.repository.js";
import type { PaymentInput } from "../types/payment.types.js";

export class PrismaPaymentRepository implements PaymentRepository {
  async createPayment(tx:Prisma.TransactionClient, payment: PaymentInput): Promise<PaymentResponse> {
    
    const paid_at = payment.status === PaymentStatus.PAID ? new Date() : null;

    const created = await tx.payment.create({
      data: {
        order_id: payment.order_id,
        user_id: payment.user_id,
        total_amount: Number(payment.total_amount),
        payment_method: payment.payment_method,
        transaction_id: payment.transaction_id,
        status: PaymentStatus,
        paid_at:paid_at,
      },
    });

    return {
      id: created.id,
      order_id: created.order_id,
      user_id: created.userId || 0,
      total_amount: Number(created.total_amount),
      payment_method: created.payment_method,
      transaction_id: created.transaction_id || '',
      status: created.PaymentStatus,
      paid_at: created.paid_at,
      created_at: created.created_at,
    };
  }

  async findPaymentByOrderId(orderId: number): Promise<PaymentResponse | null> {
    const payment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) return null;

    return {
      id: payment.id,
      order_id: payment.order_id,
      user_id: payment.user_id || 0,
      total_amount: Number(payment.total_amount),
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id || '',
      status: payment.PaymentStatus,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
    };
  }
}