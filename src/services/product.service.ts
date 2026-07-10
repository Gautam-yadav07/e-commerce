import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import type { CreateProductInput } from "../types/product.types.js";
import { AppError } from "../utils/appError.js";



const productRepository = ProductRepositoryFactory.create()
const sellerRepository = SellerRepositoryFactory.create()



export const createProductService = async(data:CreateProductInput)=>{

  const {name, description, price, seller_id, status, stock, discount} = data;

  const isSeller = await sellerRepository.findSellerProfileByUserId(seller_id)


  if(!isSeller){
    throw new AppError(403, "You are not allowed to Add product")
  }

  const newProduct = await productRepository.createProduct(data);

  return newProduct


}