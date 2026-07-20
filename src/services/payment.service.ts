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


export const processPaymentService = async (data:UserPaymentInput): Promise<PaymentResponse> => {

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

  const paymentInput = { ...data, total_amount:order.total_amount}
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



export const createRazorPayOrder = async(user_id:number, order_id:number):Promise<CreateRazorpayOrderResponse> =>{

  const order = await orderRepository.findOrderById(order_id)
  if(!order){
    throw new AppError(404, "Order not found")
  }

  if(order.user_id !== user_id){
    throw new AppError(403, "This is not your order")
  }

  if(order.payment_status === PaymentStatus.PAID){
    throw new AppError(400, "This order has already been paid")
  }

  const existingPayment = await paymentRepository.findPaymentByOrderId(order_id);

  if(existingPayment && existingPayment.payment_status === PaymentStatus.PENDING && existingPayment.razorpay_order_id){
    return {
      razorpay_order_id:existingPayment.razorpay_order_id||'',
      amount:existingPayment.total_amount,
      currency: "INR",
      order_id:existingPayment.order_id
    }
  }
  const amountInPaise = Number(existingPayment?.total_amount) * 100;

  const razorpayOrder = await razorpay.orders.create({
    amount:amountInPaise,
    currency:"INR",
    receipt: `order_${order_id}`,
    notes:{
      user_id:user_id,
      order_id:order_id
    }

  });
   await prisma.$transaction(async(tx)=>{
    const newPayment = await paymentRepository.createPayment(tx,{
      order_id,
      user_id,
      total_amount: Number(order.total_amount),
      payment_method: PaymentMethod.UPI,
      payment_status: PaymentStatus.PENDING,
      razorpay_order_id: razorpayOrder.id,
      
  });
  return{
    razorpay_order_id: razorpayOrder.id,
    amount: amountInPaise,
    currency: 'INR',
    order_id: order_id,
  }

  });

}

 export const verifyPayment = async(data:VerifyPayment)=>{
    const secret_key = process.env.RAZORPAY_SECRET_KEY
    if(!secret_key){
      throw new AppError(400, "Secret Key is not configured");
    }

    const generatedSignature = crypto.createHmac('SHA256', secret_key).update(data.razorpay_order_id+ "|" +data.razorpay_payment_id).digest("hex");

    if(data.razorpaySignature !== generatedSignature){
      throw new AppError(403, "Signature Verification Failed")
    }

    const payment = await paymentRepository.findPaymentByRazorpayOrderId(data.razorpay_order_id)

    if(!payment){
      throw new AppError(404, "Payment Not found for this Order")
    }
    if(payment.order_id !== data.order_id){
      throw new AppError(400, "Order ID mismatch");
    }

    if(payment.payment_status === PaymentStatus.PAID){
      return payment;
    }
    
}


