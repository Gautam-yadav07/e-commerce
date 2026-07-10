import prisma from "../config/prisma.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { CreateProductInput, ProductResponse } from "../types/product.types.js";

export class PrismaProductRepository implements ProductRepository {
  async createProduct(product: CreateProductInput): Promise<ProductResponse> {
    const newProduct = await prisma.products.create({
      data:{
        seller_id:product.seller_id,
        name:product.name,
        description:product.description,
        price:product.price,
        status:product.status || 'ACTIVE',
        stock:product.stock,
        discount:product.discount ?? null

      }
    })

    return {
      id:newProduct.id,
      seller_id:newProduct.seller_id,
      name:newProduct.name,
      description:newProduct.description,
      price:Number(newProduct.price),
      discount:Number(newProduct.discount),
      status:newProduct.status,
      stock:newProduct.stock,
      created_at:newProduct.created_at,
      updated_at:newProduct.updated_at

    }
  }
}