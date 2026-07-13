import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import type { CreateProductInput, UpdateProductInput } from "../types/product.types.js";
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


export const updateProductService = async(sellerUserId:number,productId:number, data:UpdateProductInput)=>{
  const seller = await sellerRepository.findSellerProfileByUserId(sellerUserId);
  if(!seller){
    throw new AppError(403, "Seller profile not found")
  }

  const existing = await productRepository.getProductById(productId);
  if(!existing){
    throw new AppError(404, "Product not found");

  }

  if(existing.seller_id !== seller.id){
    throw new AppError(403,"You are not allowed to update this product")
  }
  const updatedProduct = await productRepository.updateProduct(productId, data);

  return updatedProduct
}


export const deleteProductService = async (sellerUserId: number, productId: number): Promise<void> => {
  const seller = await sellerRepository.findSellerProfileByUserId(sellerUserId);
  if (!seller) {
    throw new AppError(404, "Seller Profile not found");
  }

  const existing = await productRepository.getProductById(productId);
  if (!existing) {
    throw new AppError(404, "Product not found");
  }

  if (existing.seller_id !== seller.id) {
    throw new AppError(403, "You do not have permission to delete this product");
  }

  await productRepository.deleteProduct(productId);
};



export const getProductBySellerIdService = async(sellerId:number)=>{

  const seller = await sellerRepository.findSellerProfileByUserId(sellerId);
  if(!seller){
    throw new AppError(404, "Seller profile not found");
  }

  const products = await productRepository.getProductBySellerId(seller.id);
  return products

}