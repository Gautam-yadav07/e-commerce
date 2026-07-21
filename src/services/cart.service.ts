import { CartRepositoryFactory } from "../factories/cart.repository.factory.js";
import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import type { CartDetails, CartItemResponse } from "../types/cart.types.js";
import { AppError } from "../utils/appError.js";

const cartRepository = CartRepositoryFactory.create();
const productRepository = ProductRepositoryFactory.create()

export const getOrCreateUserCartService = async (userId: number) => {
  let userCart = await cartRepository.getCartByUserId(userId);

  if (!userCart) {
    userCart = await cartRepository.createCart(userId);
  }
  return userCart;
};

export const getCartService = async (
  userId: number
): Promise<{ cartId: number; items: CartDetails[]; total: number }> => {
  const cart = await getOrCreateUserCartService(userId);

  const items = await cartRepository.getCartDetails(cart.id);

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product_price) * item.quantity;
  }, 0);

  return {
    cartId: cart.id,
    items,
    total,
  };
};


export const addItemToCartService = async (
  userId: number,
  productId: number,
  quantity: number
): Promise<CartItemResponse> => {

  if (quantity <= 0) {
    throw new AppError(400, "Quantity must be greater than zero.");
  }

  const cart = await getOrCreateUserCartService(userId);

  const product = await productRepository.getProductById(productId);

  if (!product || product.status !== "ACTIVE") {
    throw new AppError(404, "Product is not available or inactive.");
  }

  const existingItem = await cartRepository.findCartItem(cart.id, productId);

  const newQty = (existingItem?.quantity || 0) + quantity;

  if (product.stock < newQty) {
    throw new AppError(
      400,
      `Cannot add product. Only ${product.stock} items in stock.`
    );
  }

  const finalPrice = Math.max(
    Number(product.price) - Number(product.discount ?? 0),
    0
  );

  return await cartRepository.addCartItem(
    cart.id,
    productId,
    quantity,
    finalPrice
  );
};


export const updateItemQuantityService = async (userId: number, itemId: number, quantity: number): Promise<CartItemResponse> => {
  if (quantity <= 0) {
    throw new AppError(400,'Quantity must be greater than zero. To remove, delete the item.');
  }

  const cartItem = await cartRepository.findCartItemById(itemId);
  if (!cartItem) {
    throw new AppError(404,'Cart item not found.');
  }

  if (cartItem.user_id !== userId) {
    throw new AppError(403,'You do not own this cart item.' );
  }

  // Check stock
  const product = await productRepository.getProductById(cartItem.product_id);
  if (!product || product.status !== 'ACTIVE') {
    throw new AppError(400,'Product is no longer available.');
  }

  if (product.stock < quantity) {
    throw new AppError( 400,`Cannot update quantity. Only ${product.stock} items in stock.`);
  }

  return await cartRepository.updateCartItemQuantity(itemId, quantity);
};



export const removeItemFromCartService = async (userId: number, itemId: number): Promise<void> => {
  const cartItem = await cartRepository.findCartItemById(itemId);
  if (!cartItem) {
    throw new AppError( 404,'Cart item not found.');
  }

  if (cartItem.user_id !== userId) {
    throw new AppError(403, 'You do not own this cart item.');
  }

  await cartRepository.removeCartItem(itemId);
};