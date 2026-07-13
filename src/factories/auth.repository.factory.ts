import { PrismaAuthRepository } from "../implements/auth.prismaRepository.js";
import type { AuthRepository } from "../repositories/auth.repository.js";



export class AuthRepositoryFactory {
  private static  repository = new PrismaAuthRepository();

  static create(): AuthRepository {
    return this.repository;
  }
}