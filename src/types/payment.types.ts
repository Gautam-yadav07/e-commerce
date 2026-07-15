import type { PaymentMethod, PaymentStatus } from "../generated/prisma/enums.js";

export interface PaymentInput {
  order_id: number;
  user_id: number;
  total_amount: number;
  payment_method: PaymentMethod;
  transaction_id: string;
  payment_status: PaymentStatus;
  paid_at:Date
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
}