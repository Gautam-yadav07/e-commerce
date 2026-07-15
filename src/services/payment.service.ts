import prisma from "../config/prisma.js";
import { OrderRepositoryFactory } from "../factories/order.repository.factory.js";
import { PaymentRepositoryFactory } from "../factories/payment.repository.factory.js";
import { PaymentStatus } from "../generated/prisma/enums.js";
import { AppError } from "../utils/appError.js";

export const processPayment = async (
  userId: number,
  orderId: number,
  payment_method: string,
  transaction_id: string,
  status: PaymentStatus
): Promise<PaymentResponse> => {


  const orderRepository = OrderRepositoryFactory.create()
  const paymentRepository = PaymentRepositoryFactory.create()

  const order = await orderRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404, 'Order not found.');
  }

  if (order.user_id !== userId) {
    throw new AppError(403, 'This order does not belong to you.');
  }

  if (order.payment_status === PaymentStatus.PAID) {
    throw new AppError(400, 'This order has already been paid.');
  }

  
  return await prisma.$transaction(async(tx)=>{
    const paymentInput = {
      orderId,
      userId,
      total_amount: Number(order.total_amount),
      payment_method,
      transaction_id,
      status,
    };

    
    const payment = await paymentRepository.createPayment(tx,paymentInput);

    if (status === PaymentStatus.PAID) {
      await orderRepository.updateOrderPaymentStatus(orderId, PaymentStatus.PAID,);
      await orderRepository.updateOrderStatus(orderId, PaymentStatus.PROCESSING);
    } else {
      await orderRepository.updateOrderPaymentStatus(orderId, PaymentStatus.FAILED);
    }

    return payment;
  })

};

export const getPaymentDetails = async (userId: number, orderId: number): Promise<PaymentResponse> => {
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

