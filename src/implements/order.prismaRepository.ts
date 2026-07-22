
import prisma from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import { OrderStatus, PaymentStatus } from "../generated/prisma/enums.js";
import type { OrderRepository } from "../repositories/order.repository.js";
import type { OrderInput, OrderItemInput, OrderItemResponse, OrderResponse } from "../types/order.types.js";



export class PrismaOrderRepository implements OrderRepository{
    async createOrder(tx:Prisma.TransactionClient,order: OrderInput): Promise<OrderResponse> {
    
        const createdOrder = await tx.order.create({

            data: {
                user_id: order.userId,
                address_id: order.address_id,
                total_amount: Number(order.total_amount),
                payment_status: PaymentStatus.PENDING,
                order_status: OrderStatus.PENDING,
                address_line: order.address_line,
                city: order.city,
                state: order.state,
                country: order.country,
                pin_code: order.pin_code,
                idempotency_key:order.idempotency_key
            },
            include:{
                address:true
            }
        });


        return {
            id: createdOrder.id,
            user_id: createdOrder.user_id,
            address_id: createdOrder.address_id,
            total_amount: Number(createdOrder.total_amount),
            payment_status: createdOrder.payment_status,
            order_status: createdOrder.order_status,
            created_at: createdOrder.created_at,
            updated_at: createdOrder.updated_at,
            address_line: createdOrder.address_line,
            city: createdOrder.city,
            state: createdOrder.state,
            country: createdOrder.country,
            pin_code: createdOrder.pin_code,
            
        };
  }

    async createOrderItem(tx:Prisma.TransactionClient, item: OrderItemInput): Promise<OrderItemResponse> {
    
        const created = await tx.orderItems.create({

            data: {
                order_id: item.order_id,
                product_id: item.product_id,
                seller_id: item.seller_id,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.subtotal),
                order_status: item.order_status,
            },
        });


        return {
            id: created.id,
            order_id: created.order_id,
            product_id: created.product_id,
            seller_id: created.seller_id,
            quantity: created.quantity,
            price: Number(created.price),
            subtotal: Number(created.subtotal),
            order_status: created.order_status,
            created_at: created.created_at,
            updated_at: created.updated_at,
        };
    }

    async findOrdersByUserId(userId: number): Promise<OrderResponse[]> {
        const orders = await prisma.order.findMany({
            where: {user_id: userId },
            include: {
                address: true,
            },
            orderBy: { created_at: 'desc' },
        });

        return orders.map((order) => ({
            id: order.id,
            user_id: order.user_id,
            address_id: order.address_id,
            total_amount: Number(order.total_amount),
            payment_status: order.payment_status,
            order_status: order.order_status,
            created_at: order.created_at,
            updated_at: order.updated_at,
            address_line: order.address_line || order.address?.address_line || '',
            city: order.city || order.address?.city || '',
            state: order.state || order.address?.state || '',
            country: order.country || order.address?.country || '',
            pincode: order.pin_code || order.address?.pin_code || '',
        }));
  }

  async findOrderById(orderId: number): Promise<OrderResponse | null> {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                address: true,
                user: {
                    select: { name: true, email: true },
                },
            },
        });

        if (!order) return null;

        return {
            id: order.id,
            user_id: order.user_id,
            address_id: order.address_id,
            total_amount: Number(order.total_amount),
            payment_status: order.payment_status,
            order_status: order.order_status,
            created_at: order.created_at,
            updated_at: order.updated_at,
            address_line: order.address_line || order.address?.address_line || '',
            city: order.city || order.address?.city || '',
            state: order.state || order.address?.state || '',
            country: order.country || order.address?.country || '',
            pin_code: order.pin_code || order.address?.pin_code || '',
            user_name: order.user.name,
            user_email: order.user.email,
        };
    }

  async findOrderItemsByOrderId(orderId: number): Promise<OrderItemResponse[]> {
        const items = await prisma.orderItems.findMany({
            where: {order_id: orderId },
            include: {
                product: {
                    include: {
                        seller: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });

        return items.map((orderItem) => ({
            id: orderItem.id,
            order_id: orderItem.order_id,
            product_id: orderItem.product_id,
            seller_id: orderItem.seller_id ,
            quantity: orderItem.quantity,
            price: Number(orderItem.price),
            subtotal: Number(orderItem),
            order_status: orderItem.order_status,
            created_at: orderItem.created_at,
            updated_at: orderItem.updated_at,
            product_name: orderItem.product?.name,
            shop_name: orderItem.product?.seller?.shop_name,
        }));
    }

  async findOrderItemById(itemId: number): Promise<OrderItemResponse | null> {
        const orderItem = await prisma.orderItems.findUnique({
            where: { id: itemId },
        });

        if (!orderItem) return null;

        return {
            id: orderItem.id,
            order_id: orderItem.order_id || 0,
            product_id: orderItem.product_id || 0,
            seller_id: orderItem.seller_id || 0,
            quantity: orderItem.quantity,
            price: Number(orderItem),
            subtotal: Number(orderItem.subtotal),
            order_status: orderItem.order_status,
            created_at: orderItem.created_at,
            updated_at: orderItem.updated_at,
        };
    }

    async updateOrderStatus(tx:Prisma.TransactionClient, orderId: number, status: OrderStatus): Promise<void> {
    
        const orderStatus = await tx.order.update({
            where: { id: orderId },
            data: {
                order_status: status,
                updated_at: new Date(),
            },
        });
    }

    async updateOrderPaymentStatus(tx:Prisma.TransactionClient, orderId: number, status: PaymentStatus): Promise<void> {
        const paymentStatus = await prisma.order.update({
            where: { id: orderId },
            data: {
                payment_status: status,
                updated_at: new Date(),
            },
        });
    }

    async updateOrderItemStatus(tx:Prisma.TransactionClient, itemId: number, status: OrderStatus): Promise<void> {
        const updatedStauts = await tx.orderItems.update({
            where: { id: itemId },
            data: {
                order_status: status,
                updated_at: new Date(),
            },
        });
    }

    async findOrderByIdempotencyKey(idempotency_key: string): Promise<OrderResponse | null> {
        const order = await prisma.order.findUnique({
            where:{idempotency_key}
        })
        if(!order) return null;

        return {
            id: order.id,
            user_id: order.user_id,
            address_id: order.address_id,
            total_amount: Number(order.total_amount),
            payment_status: order.payment_status,
            order_status: order.order_status,
            created_at: order.created_at,
            updated_at: order.updated_at,
            address_line: order.address_line,
            city: order.city,
            state: order.state,
            country: order.country,
            pin_code: order.pin_code,
        }
    }
}