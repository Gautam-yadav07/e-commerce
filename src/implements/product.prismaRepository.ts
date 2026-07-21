import prisma from "../config/prisma.js";
import type { Prisma } from "../generated/prisma/client.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { CreateProductInput, ProductResponse, UpdateProductInput } from "../types/product.types.js";

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
    });
    

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

  async getAllProducts(): Promise<ProductResponse[]> {
  const products = await prisma.products.findMany({
    orderBy: {
      created_at: "desc",
    },
    include:{
      seller:true
    }
  });

    return products.map((product) => ({
      id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount),
      stock: product.stock,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
      shop_name:product.seller.shop_name
    }));
}

async getProductById(id: number): Promise<ProductResponse | null> {
  const product = await prisma.products.findUnique({
    where:{id},
    include:{
      seller:true
    }
  });
  if(!product){
    return null;
  }

  return {
      id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount),
      stock: product.stock,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
      shop_name:product.seller.shop_name,
      seller_user_id:product.seller.user_id
  }
}

async updateProduct(id: number, product: UpdateProductInput): Promise<ProductResponse> {

  const data: Prisma.ProductsUpdateInput = {};

      const fields = [
        "name",
        "description",
        "price",
        "discount",
        "stock",
        "status",
      ] as const;

      for (const field of fields) {
        if (product[field] !== undefined) {
          data[field] = product[field];
        }
      }


    await prisma.products.update({
      where: { id },
      data,
    });

  const updatedProduct = await prisma.products.update({
    where:{id},
    data
  });
  return {
      id: updatedProduct.id,
      seller_id: updatedProduct.seller_id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: Number(updatedProduct.price),
      discount: Number(updatedProduct.discount),
      stock: updatedProduct.stock,
      status: updatedProduct.status,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
  }
}

  async updateProductStock(tx:Prisma.TransactionClient,  id: number, newStock: number): Promise<void> {
    const updatedStock = await tx.products.update({
      where: { id },
      data: {
        stock: newStock,
        updated_at: new Date(),
      },
    });
  }

async deleteProduct(id: number): Promise<Boolean> {
  const deleteProduct = await prisma.products.delete({
    where:{id}
  })
  return true;
}

async getProductBySellerId(id: number): Promise<ProductResponse[]> {
  const products = await prisma.products.findMany({
    where:{seller_id:id},
    orderBy:{
      created_at:'desc'
    },
    include:{
      seller:true
    }
  })
  return products.map((product) => ({
      id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount),
      stock: product.stock,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
      shop_name:product.seller.shop_name
    }));
}
}


