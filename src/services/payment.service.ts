import prisma from "../config/prisma.js";
import { OrderRepositoryFactory } from "../factories/order.repository.factory.js";
import { PaymentRepositoryFactory } from "../factories/payment.repository.factory.js";
import { OrderStatus, PaymentStatus } from "../generated/prisma/enums.js";
import type { PaymentInput, PaymentResponse } from "../types/payment.types.js";
import { AppError } from "../utils/appError.js";



  const orderRepository = OrderRepositoryFactory.create()
  const paymentRepository = PaymentRepositoryFactory.create()


export const processPaymentService = async (data:PaymentInput): Promise<PaymentResponse> => {

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

  const paymentInput = {total_amount:order.total_amount, ...data}
  return await prisma.$transaction(async(tx)=>{

    const payment = await paymentRepository.createPayment(tx, paymentInput);

    if (data.payment_status === PaymentStatus.PAID) {
      await orderRepository.updateOrderPaymentStatus(tx,data.order_id, PaymentStatus.PAID,);
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
    throw new AppError(404,'Order not found.');
  }

  if (order.user_id !== userId) {
    throw new AppError(403,'You do not have permission to view payment details for this order.');
  }

  const payment = await paymentRepository.findPaymentByOrderId(orderId);
  if (!payment) {
    throw new AppError(404, 'No payment record found for this order.');
  }

  return payment;
};

