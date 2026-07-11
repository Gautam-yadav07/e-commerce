import { CartRepositoryFactory } from "../factories/cart.repository.factory.js";
import type { CartDetails } from "../types/cart.types.js";

const cartRepository = CartRepositoryFactory.create();

export const getOrCreateUserCartService = async (userId: number) => {
  let userCart = await cartRepository.getCartByUserId(userId);

  if (!userCart) {
    userCart = await cartRepository.createCart(userId);
  }
  return userCart;
};

export const getCartService = async (
  userId: number,
): Promise<{ cartId: number; items: CartDetails[]; total: number }> => {
  const cart = await getOrCreateUserCartService(userId);
  const items = await cartRepository.getCartDetails(cart.id);

    const total = items.reduce((sum, item) => {
    const discount = item.product_discount ?? 0;

    const finalPrice = (Number(item.product_price) - Number(discount),0);

    return sum + finalPrice * item.quantity;
  }, 0);

  return {
    cartId: cart.id,
    items,
    total,
  };
};
