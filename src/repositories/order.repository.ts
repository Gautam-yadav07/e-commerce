import type { Prisma } from "../generated/prisma/client.js";
import type {  OrderInput, OrderItemInput, OrderItemResponse, OrderResponse } from "../types/order.types.js"



export interface OrderRepository{
    createOrder(tx:Prisma.TransactionClient, item:OrderInput):Promise<OrderResponse>;

    createOrderItem(tx:Prisma.TransactionClient, item: OrderItemInput): Promise<OrderItemResponse>;

    findOrdersByUserId(userId: number): Promise<OrderResponse[]>;

    findOrderById(orderId: number): Promise<OrderResponse | null>;

    findOrderItemsByOrderId(orderId: number): Promise<OrderItemResponse[]>;

    findOrderItemById(itemId: number): Promise<OrderItemResponse | null>;

    updateOrderStatus(orderId: number, status: string,): Promise<void>;

    updateOrderPaymentStatus(orderId: number, status: string): Promise<void>;
    
    updateOrderItemStatus(itemId: number, status: string): Promise<void>;
}


 