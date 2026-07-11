import prisma from "../config/prisma.js";
import type { CartRepository } from "../repositories/cart.repository.js";
import type { CartDetails, CartItemResponse, CartResponse } from "../types/cart.types.js";


export class PrismaCartRepository implements CartRepository{
    async createCart(userId: number): Promise<CartResponse> {
        const cart = await prisma.carts.create({
            data:{
                user_id:userId
            }
        })
        return{
            id:cart.id,
            user_id:cart.user_id,
            created_at:cart.created_at,
            updated_at:cart.updated_at
        }
    }
    async getCartByUserId(userId: number): Promise<CartResponse | null> {
        const cart = await prisma.carts.findUnique({
            where:{user_id:userId}
        })
        if(!cart){
            return null
        }

        return {
            id:cart.id,
            user_id:cart.user_id,
            created_at:cart.created_at,
            updated_at:cart.updated_at
        }
    }

    async getCartDetails(cartId: number): Promise<CartDetails[]> {
        const cartItems = await prisma.cartItems.findMany({
            where:{cart_id:cartId},
            include:{
                product:{
                    include:{
                        seller:true
                    }
                }
            },
            orderBy:{created_at:'desc'}
        })
        return cartItems.map((item) => ({
            cart_item_id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            cart_item_price: Number(item.price),
            product_name: item.product.name,
            product_description: item.product.description,
            product_price: Number(item.product.price),
            product_discount: item.product.discount
                ? Number(item.product.discount)
                : null,
            product_stock: item.product.stock,
            product_status: item.product.status,
            shop_name: item.product.seller?.shop_name ?? "",
            seller_user_id: item.product.seller?.user_id ?? 0,
        }));
    }
}