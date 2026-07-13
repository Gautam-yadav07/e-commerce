
import prisma from "../config/prisma.js";
import type { OrderStatus, PaymentStatus } from "../generated/prisma/enums.js";
import type { OrderRepository } from "../repositories/order.repository.js";
import type { OrderInput, OrderItemInput, OrderItemResponse, OrderResponse } from "../types/order.types.js";



export class PrismaOrderRepository implements OrderRepository{
     async createOrder(order: OrderInput): Promise<OrderResponse> {
    
    const created = await prisma.order.create({
      data: {
        user_id: order.userId,
        address_id: order.address_id,
        total_amount: Number(order.total_amount),
        payment_status: 'PENDING',
        order_status: 'PENDING',
        address_line: order.address_line,
        city: order.city,
        state: order.state,
        country: order.country,
        pin_code: order.pin_code,
      },
      include:{
        address:true
      }
    });

    return {
      id: created.id,
      user_id: created.user_id,
      address_id: created.address_id,
      total_amount: Number(created.total_amount),
      payment_status: created.payment_status,
      order_status: created.order_status,
      created_at: created.created_at,
      updated_at: created.updated_at,
      address_line: created.address_line,
      city: created.city,
      state: created.state,
      country: created.country,
      pin_code: created.pin_code,
    };
  }

  async createOrderItem(item: OrderItemInput): Promise<OrderItemResponse> {
    
    const created = await prisma.orderItems.create({
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
      order_id: created.order_id|| 0,
      product_id: created.product_id || 0,
      seller_id: created.seller_id || 0,
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

    return orders.map((o) => ({
      id: o.id,
      user_id: o.user_id,
      address_id: o.address_id,
      total_amount: Number(o.total_amount),
      payment_status: o.payment_status,
      order_status: o.order_status,
      created_at: o.created_at,
      updated_at: o.updated_at,
      address_line: o.address_line || o.address?.address_line || '',
      city: o.city || o.address?.city || '',
      state: o.state || o.address?.state || '',
      country: o.country || o.address?.country || '',
      pincode: o.pin_code || o.address?.pin_code || '',
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

    return items.map((oi) => ({
      id: oi.id,
      order_id: oi.order_id || 0,
      product_id: oi.product_id || 0,
      seller_id: oi.seller_id || 0,
      quantity: oi.quantity,
      price: Number(oi.price),
      subtotal: Number(oi.subtotal),
      order_status: oi.order_status,
      created_at: oi.created_at,
      updated_at: oi.updated_at,
      product_name: oi.product?.name,
      shop_name: oi.product?.seller?.shop_name,
    }));
  }

  async findOrderItemById(itemId: number): Promise<OrderItemResponse | null> {
    const oi = await prisma.orderItems.findUnique({
      where: { id: itemId },
    });

    if (!oi) return null;

    return {
      id: oi.id,
      order_id: oi.order_id || 0,
      product_id: oi.product_id || 0,
      seller_id: oi.seller_id || 0,
      quantity: oi.quantity,
      price: Number(oi.price),
      subtotal: Number(oi.subtotal),
      order_status: oi.order_status,
      created_at: oi.created_at,
      updated_at: oi.updated_at,
    };
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    
    const orderStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        order_status: status,
        updated_at: new Date(),
      },
    });
  }

  async updateOrderPaymentStatus(orderId: number, status: PaymentStatus): Promise<void> {
    const paymentStatus = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: status,
        updated_at: new Date(),
      },
    });
  }

  async updateOrderItemStatus(itemId: number, status: OrderStatus): Promise<void> {
    await prisma.orderItems.update({
      where: { id: itemId },
      data: {
        order_status: status,
        updated_at: new Date(),
      },
    });
  }
}