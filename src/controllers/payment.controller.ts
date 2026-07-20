import type { Request, Response, NextFunction } from "express";
import {
  processPaymentService,
  getPaymentDetailsService,
  createRazorPayOrderService,
  verifyPaymentService,
} from "../services/payment.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";

export const processPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
     const user_id =  req.user.id

    const data = {user_id, paid_at:new Date(), ...req.body}
    const payment = await processPaymentService(data);

    handleSuccessResponse(res, 201,  
      payment.payment_status === "PAID"
    ? "Payment processed successfully"
    : "Payment failed", payment)

  } catch (error) {
    next(error);
  }
};

export const getPaymentDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.orderId);

    const payment = await getPaymentDetailsService(userId, orderId);

    handleSuccessResponse(res, 200, "Payment details fetched successfully", payment)

  } catch (error) {
    next(error);
  }
};


export const createRazorpayOrderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user!.id;
    const { order_id } = req.body;

    const razorpayOrderData = await createRazorPayOrderService(user_id, order_id);

    handleSuccessResponse(res, 201, "Razorpay order created successfully", razorpayOrderData)
  } catch (error) {
    next(error);
  }
};

export const verifyPaymentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
    const data = {...req.body}

    const payment = await verifyPaymentService(data);

    handleSuccessResponse(res, 200, "Payment verified Successfully", payment)

  } catch (error) {
    next(error);
  }
};