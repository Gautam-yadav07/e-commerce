import type { CartDetails, CartItemResponse, CartResponse } from "../types/cart.types.js";


export interface CartRepository{
    createCart(userId:number):Promise<CartResponse>;

    getCartByUserId(userId:number):Promise<CartResponse|null>;

    getCartDetails(cartId:number):Promise<CartDetails[]>

}