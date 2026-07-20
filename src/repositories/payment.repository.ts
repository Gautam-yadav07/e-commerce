import type { Prisma } from "../generated/prisma/client.js";
import type { PaymentInput, PaymentResponse } from "../types/payment.types.js";

export interface PaymentRepository {
  createPayment(tx:Prisma.TransactionClient, payment: PaymentInput): Promise<PaymentResponse>;
  
  findPaymentByOrderId(orderId: number): Promise<PaymentResponse | null>;

  findPaymentByRazorpayOrderId(razorPayOrderId:string):Promise<PaymentResponse | null>;
}
