import type { CartDetails, CartItemResponse, CartResponse } from "../types/cart.types.js";


export interface CartRepository {
    createCart(userId: number): Promise<CartResponse>;

    getCartByUserId(userId: number): Promise<CartResponse | null>;

    getCartDetails(cartId: number): Promise<CartDetails[]>

    findCartItem(cartId: number, productId: number): Promise<CartItemResponse | null>;

    findCartItemById(itemId: number): Promise<CartItemResponse | null>;

    addCartItem(cartId: number, productId: number, quantity: number, price: number): Promise<CartItemResponse>;

    updateCartItemQuantity(itemId: number, quantity: number): Promise<CartItemResponse>

    removeCartItem(itemId: number): Promise<boolean>;

}