import { z } from "zod";
import {
  PaymentMethod,
  PaymentStatus,
} from "../generated/prisma/enums.js";

export const processPaymentSchema = z.object({
  body: z.object({
    order_id: z.number("Order ID is required").int(),

    payment_method: z.nativeEnum(PaymentMethod, "Payment method is required"),

    transaction_id: z.string("Transaction ID is required").trim(),

    payment_status: z.nativeEnum(PaymentStatus, "Payment status is required"),
  }),
});

