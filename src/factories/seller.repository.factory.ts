import { PrismaSellerRepository } from "../implements/seller.prismaRepository.js";
import type { SellerRepository } from "../repositories/seller.repository.js";


export class SellerRepositoryFactory{
  public static repository = new PrismaSellerRepository()

  static create():SellerRepository{
    return this.repository
  }
}