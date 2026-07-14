import prisma from "../config/prisma.js";
import type { TransactionClient } from "../generated/prisma/internal/prismaNamespace.js";
import type { CartRepository } from "../repositories/cart.repository.js";
import type { CartDetails, CartItemResponse, CartResponse } from "../types/cart.types.js";


export class PrismaCartRepository implements CartRepository {
    async createCart(userId: number): Promise<CartResponse> {
        const cart = await prisma.carts.create({
            data: {
                user_id: userId
            }
        })
        return {
            id: cart.id,
            user_id: cart.user_id,
            created_at: cart.created_at,
            updated_at: cart.updated_at
        }
    }
    async getCartByUserId(userId: number): Promise<CartResponse | null> {
        const cart = await prisma.carts.findUnique({
            where: { user_id: userId }
        })
        if (!cart) {
            return null
        }

        return {
            id: cart.id,
            user_id: cart.user_id,
            created_at: cart.created_at,
            updated_at: cart.updated_at
        }
    }

    async getCartDetails(cartId: number): Promise<CartDetails[]> {
        const cartItems = await prisma.cartItems.findMany({
            where: { cart_id: cartId },
            include: {
                product: {
                    include: {
                        seller: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
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

    async findCartItem(cartId: number, productId: number): Promise<CartItemResponse | null> {
        const item = await prisma.cartItems.findUnique({
            where: {
                unique_cart_product: {
                    cart_id: cartId,
                    product_id: productId,
                },
            },
        });

        if (!item) return null;

        return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    async findCartItemById(itemId: number): Promise<CartItemResponse | null> {
        const item = await prisma.cartItems.findUnique({
            where: { id: itemId },
            include: {
                cart: true,
            },
        });

        if (!item) return null;

        return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
            user_id: item.cart.user_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    async addCartItem(cartId: number, productId: number, quantity: number, price: number): Promise<CartItemResponse> {
        const item = await prisma.cartItems.upsert({
            where: {
                unique_cart_product: {
                    cart_id: cartId,
                    product_id: productId,
                },
            },
            update: {
                quantity: { increment: quantity },
                price: Number(price),
            },
            create: {
                cart_id: cartId,
                product_id: productId,
                quantity,
                price: Number(price),
            },
        });

        return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    async updateCartItemQuantity(itemId: number, quantity: number): Promise<CartItemResponse> {
        const item = await prisma.cartItems.update({
            where: { id: itemId },
            data: { quantity },
        });

        return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    }

    async removeCartItem(itemId: number): Promise<boolean> {
        try {
            await prisma.cartItems.delete({
                where: { id: itemId },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    async clearCart(tx: TransactionClient, cartId: number): Promise<void> {
        const cart = await tx.cartItems.deleteMany({
            where:{cart_id:cartId}
        })
    }

}