import { PrismaAuthRepository } from "../implements/auth.prismaRepository.js";
import type { AuthRepository } from "../repositories/auth.repository.js";



export class UserRepositoryFactory {
  private static  repository = new PrismaAuthRepository();

  static create(): AuthRepository {
    return this.repository;
  }
}