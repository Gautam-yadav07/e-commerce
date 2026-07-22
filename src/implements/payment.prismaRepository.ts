import prisma from "../config/prisma.js";
import { PaymentStatus, type Prisma } from "../generated/prisma/client.js";
import type { PaymentRepository } from "../repositories/payment.repository.js";
import type { PaymentInput, PaymentResponse } from "../types/payment.types.js";

export class PrismaPaymentRepository implements PaymentRepository {

  private paymentResponse(payment: any): PaymentResponse {
    return {
      id: payment.id,
      order_id: payment.order_id,
      user_id: payment.user_id || 0,
      total_amount: Number(payment.total_amount),
      payment_method: payment.payment_method,
      transaction_id: payment.transaction_id || '',
      payment_status: payment.status,
      paid_at: payment.paid_at,
      created_at: payment.created_at,
      razorpay_order_id: payment.razorpay_order_id || '',
      razorpay_payment_id: payment.razorpay_payment_id || '',
      idempotency_key:payment.idempotency_key
    };
  }
  async createPayment(tx: Prisma.TransactionClient, payment: PaymentInput): Promise<PaymentResponse> {

    const created = await tx.payment.create({
      data: {
        order_id: payment.order_id,
        user_id: payment.user_id,
        total_amount: Number(payment.total_amount),
        payment_method: payment.payment_method,
        status: payment.payment_status,
        razorpay_order_id: payment.razorpay_order_id,
        idempotency_key:payment.idempotency_key
        // paid_at:payment.paid_at,
        // transaction_id: payment.transaction_id,
      },
    });

    return this.paymentResponse(created)
  }

  async findPaymentByOrderId(orderId: number): Promise<PaymentResponse | null> {
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
    });

    if (!payment) return null;

    return this.paymentResponse(payment)
  }
  async findPaymentByRazorpayOrderId(razorPayOrderId: string): Promise<PaymentResponse | null> {
    const payment = await prisma.payment.findUnique({
      where: { razorpay_order_id: razorPayOrderId }
    })
    if (!payment) {
      return null
    }

    return this.paymentResponse(payment)
  }
  async updatePaymentStatus(
    tx: Prisma.TransactionClient,
    paymentId: number,
    status: PaymentStatus,
    razorpayPaymentId?: string | null,
  ): Promise<PaymentResponse> {
    const paid_at = status === PaymentStatus.PAID ? new Date() : null;

    const updated = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: status,
        paid_at,
        razorpay_payment_id: razorpayPaymentId ?? null
      }
    });

    return this.paymentResponse(updated)
  }

  async findPaymentByIdempotencyKey(idempotency_key: string): Promise<PaymentResponse | null> {
    const payment = await prisma.payment.findUnique({
      where:{idempotency_key}
    })
    if(!payment){
      return null;
    }

    return this.paymentResponse(payment)
  }
}