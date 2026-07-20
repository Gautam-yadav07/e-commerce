import type { PaymentMethod, PaymentStatus } from "../generated/prisma/enums.js";

export interface PaymentInput {
  order_id: number;
  user_id: number;
  total_amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  payment_status: PaymentStatus;
  paid_at: Date;
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
}

export interface PaymentResponse {
  id: number;
  order_id: number;
  user_id: number;
  total_amount: number;
  payment_method: string;
  transaction_id: string;
  payment_status: PaymentStatus;
  paid_at: Date | null;
  created_at: Date;
  razorpay_order_id: string;
  razorpay_payment_id: string
}

export interface UserPaymentInput {
  order_id: number;
  user_id: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  payment_status: PaymentStatus;
  paid_at: Date;
  razorpay_order_id: string;
  razorpay_payment_id: string
}


export interface CreateRazorpayOrderInput {
  user_id: number;
  order_id: number;
}

export interface CreateRazorpayOrderResponse {
  razorpay_order_id: number;
  amount: number;
  currency: string;
}