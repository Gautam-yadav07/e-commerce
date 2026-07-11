import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import type { CreateProductInput } from "../types/product.types.js";
import { AppError } from "../utils/appError.js";



const productRepository = ProductRepositoryFactory.create()
const sellerRepository = SellerRepositoryFactory.create()



export const createProductService = async(data:CreateProductInput)=>{

  const isSeller = await sellerRepository.findSellerProfileByUserId(data.seller_id)

  if(!isSeller){
    throw new AppError(403, "You are not allowed to Add product")
  }
  
  const newProduct = await productRepository.createProduct({...data, seller_id:isSeller.id});
  return newProduct

}


export const getAllProductsService = async()=>{
  const products = productRepository.getAllProducts();
  return products;
}


export const getProductByIdService = async(id:number)=>{
  const product  = await productRepository.getProductById(id);
  if(!product){
    throw new AppError(404, "Product not found")
  }

  return product;
}