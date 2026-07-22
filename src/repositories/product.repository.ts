import type { Prisma } from "../generated/prisma/client.js";
import type { CreateProductInput, ProductResponse, UpdateProductInput } from "../types/product.types.js";


export interface ProductRepository {
  createProduct(product:CreateProductInput):Promise<ProductResponse>
  getAllProducts():Promise<ProductResponse[]>
  getProductById(id:number):Promise<ProductResponse |null>

  updateProduct(id:number, product:UpdateProductInput):Promise<ProductResponse>
  deleteProduct(id:number):Promise<Boolean>;

  getProductBySellerId(id:number):Promise<ProductResponse[]>
  updateProductStock(tx:Prisma.TransactionClient, id:number, newStock:number):Promise<void>
}




