import type { NextFunction, Request, Response } from "express";
import { checkoutService, getOrderByIdService, getOrdersService, updateOrderItemStatusService } from "../services/order.service.js";
import { handleSuccessResponse } from "../utils/handleSuccessResponse.js";

export const checkoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const { address_id } = req.body;

    const idempotency_key = req.headers['x-idempotency-key'] as string

    const order = await checkoutService(userId, address_id, idempotency_key);
    handleSuccessResponse(res, 201, "Order placed successfully", order)

  } catch (error) {
    next(error);
  }
};

export const getMyOrdersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const orders = await getOrdersService(userId);

    handleSuccessResponse(res, 200, "All order of a User fetched successfully", orders);

  } catch (error) {
    next(error);
  }
};

export const getByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const orderId = Number(req.params.id);

    const order = await getOrderByIdService(userId, orderId);

    handleSuccessResponse(res, 200, "Order fetched successfully", order);

  } catch (error) {
    next(error);
  }
};

export const updateOrderItemStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerUserId = req.user!.id;
    const itemId = Number(req.params.itemId);
    const { status } = req.body;

    const updatedOrder = await updateOrderItemStatusService(sellerUserId, itemId, status);

    handleSuccessResponse(res, 200, "Order item status updated successfully", updatedOrder)


  } catch (error) {
    next(error);
  }
};
