import { PrismaProductRepository } from "../implements/product.prismaRepository.js";
import type { ProductRepository } from "../repositories/product.repository.js";




export class ProductRepositoryFactory {
  private static repository = new PrismaProductRepository()

  static create():ProductRepository{
    return this.repository
  }
}