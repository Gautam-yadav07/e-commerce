import type { CreateProductInput, ProductResponse } from "../types/product.types.js";


export interface ProductRepository {
  createProduct(product:CreateProductInput):Promise<ProductResponse>
  getAllProducts():Promise<ProductResponse[]>
  getProductById(id:number):Promise<ProductResponse |null>
}




