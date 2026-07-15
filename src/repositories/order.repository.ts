import type { Prisma } from "../generated/prisma/client.js";
import type {  OrderInput, OrderItemInput, OrderItemResponse, OrderResponse } from "../types/order.types.js"



export interface OrderRepository{
    createOrder(tx:Prisma.TransactionClient, item:OrderInput):Promise<OrderResponse>;

    createOrderItem(tx:Prisma.TransactionClient, item: OrderItemInput): Promise<OrderItemResponse>;

    findOrdersByUserId(userId: number): Promise<OrderResponse[]>;

    findOrderById(orderId: number): Promise<OrderResponse | null>;

    findOrderItemsByOrderId(orderId: number): Promise<OrderItemResponse[]>;

    findOrderItemById(itemId: number): Promise<OrderItemResponse | null>;

    updateOrderStatus(tx:Prisma.TransactionClient, orderId: number, status: string,): Promise<void>;

    updateOrderPaymentStatus(tx:Prisma.TransactionClient ,orderId: number, status: string): Promise<void>;
    
    updateOrderItemStatus(tx:Prisma.TransactionClient, itemId: number, status: string): Promise<void>;
}


 