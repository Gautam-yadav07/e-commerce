import prisma from "../config/prisma.js";
import { PaymentStatus, type Prisma } from "../generated/prisma/client.js";
import type { PaymentRepository } from "../repositories/payment.repository.js";
import type { PaymentInput, PaymentResponse } from "../types/payment.types.js";

export class PrismaPaymentRepository implements PaymentRepository {
  async createPayment(tx:Prisma.TransactionClient, payment: PaymentInput): Promise<PaymentResponse> {

    const created = await tx.payment.create({
      data: {
        order_id: payment.order_id,
        user_id: payment.user_id,
        total_amount: Number(payment.total_amount),
        payment_method: payment.payment_method,
        // transaction_id: payment.transaction_id,
        status: payment.payment_status,
        // paid_at:payment.paid_at,
      },
    });

    return {
      id: created.id,
      order_id: created.order_id,
      user_id: created.user_id || 0,
      total_amount: Number(created.total_amount),
      payment_method: created.payment_method,
      transaction_id: created.transaction_id || '',
      payment_status: created.status,
      paid_at: created.paid_at,
      created_at: created.created_at,
      razorpay_order_id:created.razorpay_order_id ||'',
      razorpay_payment_id:created.razorpay_payment_id ||''
    };
  }

  async findPaymentByOrderId(orderId: number): Promise<PaymentResponse | null> {
    const payment = await prisma.payment.findUnique({
      where: { order_id:orderId },
    });

    if (!payment) return null;

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
      razorpay_order_id:payment.razorpay_order_id ||'',
      razorpay_payment_id:payment.razorpay_payment_id ||''
    };
  }
  async findPaymentByRazorpayOrderId(razorPayOrderId: string): Promise<PaymentResponse | null> {
    const payment  = await prisma.payment.findUnique({
      where:{razorpay_order_id:razorPayOrderId}
    })
    if(!payment){
      return null
    }

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
      razorpay_order_id:payment.razorpay_order_id ||'',
      razorpay_payment_id:payment.razorpay_payment_id ||''
    }
  }
}