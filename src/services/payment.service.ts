import prisma from "../config/prisma.js";
import { razorpay } from "../config/razorpay.js";
import { OrderRepositoryFactory } from "../factories/order.repository.factory.js";
import { PaymentRepositoryFactory } from "../factories/payment.repository.factory.js";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../generated/prisma/enums.js";
import type { CreateRazorpayOrderResponse, PaymentInput, PaymentResponse, UserPaymentInput, VerifyPayment } from "../types/payment.types.js";
import { AppError } from "../utils/appError.js";

import crypto from 'crypto'



const orderRepository = OrderRepositoryFactory.create()
const paymentRepository = PaymentRepositoryFactory.create()


export const processPaymentService = async (data: UserPaymentInput): Promise<PaymentResponse> => {

  const order = await orderRepository.findOrderById(data.order_id);
  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.user_id !== data.user_id) {
    throw new AppError(403, 'This order does not belong to you.');
  }

  if (order.payment_status === PaymentStatus.PAID) {
    throw new AppError(400, 'This order has already been paid.');
  }

  const paymentInput = { ...data, total_amount: order.total_amount }
  return await prisma.$transaction(async (tx) => {

    const payment = await paymentRepository.createPayment(tx, paymentInput);

    if (data.payment_status === PaymentStatus.PAID) {
      await orderRepository.updateOrderPaymentStatus(tx, data.order_id, PaymentStatus.PAID,);
      await orderRepository.updateOrderStatus(tx, data.order_id, OrderStatus.PROCESSING);
    } else {
      await orderRepository.updateOrderPaymentStatus(tx, data.order_id, PaymentStatus.FAILED);
    }

    return payment;
  })

};

export const getPaymentDetailsService = async (userId: number, orderId: number): Promise<PaymentResponse> => {
  const order = await orderRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.user_id !== userId) {
    throw new AppError(403, 'You do not have permission to view payment details for this order.');
  }

  const payment = await paymentRepository.findPaymentByOrderId(orderId);
  if (!payment) {
    throw new AppError(404, 'No payment record found for this order.');
  }

  return payment;
};



export const createRazorPayOrderService = async (
  user_id: number,
  order_id: number,
  idempotency_key: string
): Promise<CreateRazorpayOrderResponse> => {

  if (idempotency_key) {
    const existingPayment = await paymentRepository.findPaymentByIdempotencyKey(idempotency_key);
    console.log(idempotency_key)
    console.log(existingPayment)

    if (existingPayment && existingPayment.razorpay_order_id) {
      return {
        razorpay_order_id: existingPayment.razorpay_order_id,
        amount: Number(existingPayment.total_amount),
        currency: "INR",
        key_id: process.env.RAZORPAY_API_KEY || "",
        order_id: existingPayment.order_id,
      };
    }
  }

  const order = await orderRepository.findOrderById(order_id);

  if (!order) {
    throw new AppError(404, "Order not found")
  }

  if (order.user_id !== user_id) {
    throw new AppError(403, "This is not your order")
  }

  if (order.payment_status === PaymentStatus.PAID) {
    throw new AppError(400, "This order has already been paid");
  }

  const existingPayment =
    await paymentRepository.findPaymentByOrderId(order_id);

  if (
    existingPayment &&
    existingPayment.payment_status === PaymentStatus.PENDING &&
    existingPayment.razorpay_order_id
  ) {
    return {
      razorpay_order_id: existingPayment.razorpay_order_id,
      amount: Number(existingPayment.total_amount),
      currency: "INR",
      key_id: process.env.RAZORPAY_API_KEY || "",
      order_id: existingPayment.order_id,
    };
  }

  const amountInPaise = Number(order.total_amount) * 100;

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `order_${order_id}`,
    notes: {
      user_id: String(user_id),
      order_id: String(order_id),
    },
  });

  return await prisma.$transaction(async (tx) => {
    const newPayment = await paymentRepository.createPayment(tx, {
      order_id,
      user_id,
      total_amount: Number(order.total_amount),
      payment_method: PaymentMethod.UPI,
      payment_status: PaymentStatus.PENDING,
      razorpay_order_id: razorpayOrder.id,
      idempotency_key: idempotency_key
    });

    return {
      razorpay_order_id: razorpayOrder.id,
      amount: newPayment.total_amount,
      currency: "INR",
      key_id: process.env.RAZORPAY_API_KEY || "",
      order_id,
    };
  });
};


export const verifyPaymentService = async (data: VerifyPayment): Promise<PaymentResponse> => {
  const secret_key = process.env.RAZORPAY_SECRET_KEY
  if (!secret_key) {
    throw new AppError(400, "Secret Key is not configured");
  }

  const generatedSignature = crypto.createHmac('SHA256', secret_key).update(data.razorpay_order_id + "|" + data.razorpay_payment_id).digest("hex");

  if (data.razorpay_signature !== generatedSignature) {
    throw new AppError(403, "Signature Verification Failed")
  }

  const payment = await paymentRepository.findPaymentByRazorpayOrderId(data.razorpay_order_id)

  if (!payment) {
    throw new AppError(404, "Payment Not found for this Order")
  }
  if (payment.order_id !== data.order_id) {
    throw new AppError(400, "Order ID mismatch");
  }

  if (payment.payment_status === PaymentStatus.PAID) {
    return payment;
  }
  return await prisma.$transaction(async (tx) => {
    const updatedPayment = await paymentRepository.updatePaymentStatus(
      tx,
      payment.id,
      PaymentStatus.PAID,
      data.razorpay_payment_id,
    );

    console.log("Updated payment", updatedPayment)

    await orderRepository.updateOrderPaymentStatus(tx, data.order_id, PaymentStatus.PAID);
    await orderRepository.updateOrderStatus(tx, data.order_id, OrderStatus.PROCESSING);

    return updatedPayment;
  });

}


export const paymentWebhookService = async (rawbody: Buffer | string,
  signature: string): Promise<void> => {

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new AppError(400, "Razorpay WEBHOOK_SECRET is not configured")
  }

  const generatedSignature = crypto.createHmac('SHA256', WEBHOOK_SECRET).update(rawbody).digest("hex");


  if (generatedSignature !== signature) {
    throw new AppError(400, "Invalid Webhook signature")
  }

  const payload = JSON.parse(rawbody.toString())

  console.log("Webhook payload", payload)

  const event = payload.event

  if (event === "payment.captured") {
    const paymentEntity = payload.payload?.payment?.entity
    if (!paymentEntity) return;

    const razorpay_order_id = paymentEntity.order_id;
    const razorpay_payment_id = paymentEntity.id;

    const payment = await paymentRepository.findPaymentByRazorpayOrderId(razorpay_order_id);

    if (!payment) {
      throw new AppError(404, `No payment record found`);
    }

    if (payment.payment_status === PaymentStatus.PAID) {
      return;
    }

    await prisma.$transaction(async (tx) => {
      await paymentRepository.updatePaymentStatus(tx, payment.id, PaymentStatus.PAID, razorpay_payment_id)

      await orderRepository.updateOrderPaymentStatus(tx, payment.order_id, PaymentStatus.PAID);

      await orderRepository.updateOrderStatus(tx, payment.order_id, OrderStatus.PROCESSING)
    })

    console.log("Payment status updated by webhook")
  }

  if (event === "payment.failed") {
    const paymentEntity = payload.payload.payment.entity;
    if (!paymentEntity) return;

    const razorpay_order_id = paymentEntity.order_id;

    const payment = await paymentRepository.findPaymentByRazorpayOrderId(razorpay_order_id);

    if (!payment) {
      throw new AppError(404, "No payment record found");
    }

    await prisma.$transaction(async (tx) => {

      await paymentRepository.updatePaymentStatus(tx, payment.id, PaymentStatus.FAILED, null)

      await orderRepository.updateOrderPaymentStatus(tx, payment.order_id, PaymentStatus.FAILED);

    })
    console.log("Payment status updated as failed by webhook ")

  }
}


