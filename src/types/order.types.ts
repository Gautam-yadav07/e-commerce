import type { OrderStatus, PaymentStatus } from "../generated/prisma/enums.js";

export interface OrderInput {
  userId: number;
  address_id: number | null;
  total_amount: number;
  address_line: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pin_code: string | null;
  idempotency_key: string
}

export interface OrderItemInput {
  order_id: number;
  product_id: number;
  seller_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  order_status: OrderStatus
}

export interface OrderResponse {
  id: number;
  user_id: number;
  address_id: number | null;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: Date;
  updated_at: Date;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pin_code?: string | null;
  user_name?: string;
  user_email?: string;
}

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  order_status: OrderStatus;
  created_at?: Date;
  updated_at?: Date;
  product_name?: string;
  shop_name?: string;
}