import prisma from "../config/prisma.js";
import { AddressRepositoryFactory } from "../factories/address.repository.factory.js";
import { CartRepositoryFactory } from "../factories/cart.repository.factory.js";
import { OrderRepositoryFactory } from "../factories/order.repository.factory.js";
import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import { OrderStatus } from "../generated/prisma/enums.js";
import type { OrderResponse, OrderItemResponse } from "../types/order.types.js";
import { AppError } from "../utils/appError.js";

interface OrderItemToCreate {
  productId: number;
  sellerId: number;
  quantity: number;
  price: number;
  subtotal: number;
}


const addressRepository = AddressRepositoryFactory.create()
const cartRepository = CartRepositoryFactory.create()
const orderRepository = OrderRepositoryFactory.create()
const productRepository = ProductRepositoryFactory.create()

export const checkoutService = async (
  userId: number,
  addressId: number
): Promise<{ order: OrderResponse; itemsCount: number }> => {

  const address = await addressRepository.getAddressById(addressId);

  if (!address) {
    throw new AppError(404, "Address not found.");
  }

  if (address.user_id !== userId) {
    throw new AppError(403, "This address does not belong to you.");
  }

  const cart = await cartRepository.getCartByUserId(userId);

  if (!cart) {
    throw new AppError(400, "Your cart is empty.");
  }

  const cartItems = await cartRepository.getCartDetails(cart.id);

  if (cartItems.length === 0) {
    throw new AppError(400, "Your cart is empty.");
  }

  return await prisma.$transaction(async(tx)=>{

    let totalAmount = 0;
    const orderItemsToCreate: OrderItemToCreate[] = [];

    for (const item of cartItems) {

    const product = await productRepository.getProductById(item.product_id);

    if (!product) {
      throw new AppError(
        400,
        `Product "${item.product_name}" no longer exists.`
      );
    }

    if (product.status !== "ACTIVE") {
      throw new AppError(
        400,
        `Product "${item.product_name}" is currently inactive.`
      );
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        400,
        `Insufficient stock for "${item.product_name}". Only ${product.stock} items remaining.`
      );
    }

    const itemPrice = item.cart_item_price;

    const subtotal = itemPrice * item.quantity;

    totalAmount += subtotal;

    const sellerUserId = product.seller_user_id;

    if (sellerUserId === undefined || sellerUserId === null) {
      throw new AppError(
        500,
        "Invalid seller profile associated with product."
      );
    }

    orderItemsToCreate.push({
      productId: product.id,
      sellerId: sellerUserId,
      quantity: item.quantity,
      price: itemPrice,
      subtotal,
    });

 
    const newStock = product.stock - item.quantity;

    await productRepository.updateProductStock(product.id, newStock);
  }

    const newOrder = await orderRepository.createOrder(tx,{
      userId,
      address_id: addressId,
      total_amount: totalAmount,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      country: address.country,
      pin_code: address.pin_code,
    });


    for (const item of orderItemsToCreate) {
      await orderRepository.createOrderItem(tx,{
        order_id: newOrder.id,
        product_id: item.productId,
        seller_id: item.sellerId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        order_status:"PENDING"
      });
  }


  // await cartRepository.clearCart(cart.id);

    return {
      order: newOrder,
      itemsCount: orderItemsToCreate.length,
    };

  })
 
};


export const getOrdersService = async (userId: number): Promise<OrderResponse[]> => {
  return await orderRepository.findOrdersByUserId(userId);
};

export const getOrderByIdService = async (userId: number, orderId: number): Promise<OrderResponse & { items: OrderItemResponse[] }> => {
  const order = await orderRepository.findOrderById(orderId);
  if (!order) {
    throw new AppError(404,'Order not found.');
  }

  if (order.user_id !== userId) {
    const items = await orderRepository.findOrderItemsByOrderId(orderId);
    const isSellerOfAnyItem = items.some((item) => item.seller_id === userId);
    
    if (!isSellerOfAnyItem) {
      throw new AppError(403, 'You do not have permission to view this order.');
    }
  }

  const items = await orderRepository.findOrderItemsByOrderId(orderId);
  return {
    ...order,
    items,
  };
};



export const updateOrderItemStatusService = async (
  sellerUserId: number,
  orderItemId: number,
  status: OrderStatus
): Promise<void> => {


  const item = await orderRepository.findOrderItemById(orderItemId);

  if (!item) {
    throw new AppError(404, "Order item not found.");
  }

  if (item.seller_id !== sellerUserId) {
    throw new AppError(
      403,
      "You do not have permission to update this order item."
    );
  }

  await orderRepository.updateOrderItemStatus(orderItemId, status);

  const siblingItems = await orderRepository.findOrderItemsByOrderId(
    item.order_id
  );

  const allStatuses = siblingItems.map((sib) =>
    sib.id === orderItemId ? status : sib.order_status
  );

  let newOrderStatus: OrderStatus = OrderStatus.PROCESSING;

  if (
    allStatuses.every((s) => s === OrderStatus.DELIVERED)
  ) {
    newOrderStatus = OrderStatus.DELIVERED;
  }

  else if (
    allStatuses.every((s) => s === OrderStatus.SHIPPED || 
    s === OrderStatus.DELIVERED)
  ) {
    newOrderStatus = OrderStatus.SHIPPED;
  }

  else if (
    allStatuses.every((s) => s === OrderStatus.CANCELLED)
  ) {
    newOrderStatus = OrderStatus.CANCELLED;
  }

  else {
    newOrderStatus = OrderStatus.PROCESSING;
  }

  await orderRepository.updateOrderStatus(
    item.order_id,
    newOrderStatus
  );
};