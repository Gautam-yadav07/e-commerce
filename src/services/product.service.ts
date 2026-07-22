import { ProductRepositoryFactory } from "../factories/product.repository.factory.js";
import { SellerRepositoryFactory } from "../factories/seller.repository.factory.js";
import type { CreateProductInput, UpdateProductInput } from "../types/product.types.js";
import { AppError } from "../utils/appError.js";
import { deleteCachedData, getCacheData, setCacheData } from "./redis.service.js";



const productRepository = ProductRepositoryFactory.create()
const sellerRepository = SellerRepositoryFactory.create()



export const createProductService = async (data: CreateProductInput) => {

  const isSeller = await sellerRepository.findSellerProfileByUserId(data.seller_id)

  if (!isSeller) {
    throw new AppError(403, "You are not allowed to Add product")
  }

  const newProduct = await productRepository.createProduct({ ...data, seller_id: isSeller.id });

  await deleteCachedData('products')
  return newProduct

}


export const getAllProductsService = async () => {
  const cacheKey = "products"
  const cachedProduct = await getCacheData(cacheKey)
  if (cachedProduct) {
    console.log("From Redis")
    return cachedProduct

  }
  console.log("Products comes from Database");
  const products = await productRepository.getAllProducts();

  const setProduct = await setCacheData(cacheKey, products)
  console.log(setProduct)
  return products;
}


export const getProductByIdService = async (id: number) => {

  const cacheKey = `product:${id}`;
  const cachedProduct = await getCacheData(cacheKey);

  if (cachedProduct) {
    console.log("Product comes from Redis")
    return cachedProduct
  }

  console.log("Data from Database")

  const product = await productRepository.getProductById(id);
  if (!product) {
    throw new AppError(404, "Product not found")
  }
  await setCacheData(cacheKey, product)

  return product;
}


export const updateProductService = async (sellerUserId: number, productId: number, data: UpdateProductInput) => {
  const seller = await sellerRepository.findSellerProfileByUserId(sellerUserId);
  if (!seller) {
    throw new AppError(403, "Seller profile not found")
  }

  const existing = await productRepository.getProductById(productId);
  if (!existing) {
    throw new AppError(404, "Product not found");

  }

  if (existing.seller_id !== seller.id) {
    throw new AppError(403, "You are not allowed to update this product")
  }
  const updatedProduct = await productRepository.updateProduct(productId, data);

  const cacheKey = `product:${productId}`
  await deleteCachedData(cacheKey);
  await deleteCachedData('products')

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

  const cacheKey = `product${productId}`
  await deleteCachedData(cacheKey)
  await deleteCachedData('products')
};



export const getProductBySellerIdService = async (sellerId: number) => {

  const cacheKey = `seller-products:${sellerId}`

  const cachedProduct = await getCacheData(cacheKey);
  if (cachedProduct) {
    return cachedProduct
  }

  console.log("Data from database");

  const seller = await sellerRepository.findSellerProfileByUserId(sellerId);
  if (!seller) {
    throw new AppError(404, "Seller profile not found");
  }

  const products = await productRepository.getProductBySellerId(seller.id);

  await setCacheData(cacheKey, products);
  return products

}