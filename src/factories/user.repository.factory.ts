import { PrismaUserRepository } from "../implements/user.prismaRepository.js";
import type { UserRepository } from "../repositories/user.repository.js";



export class UserRepositoryFactory {
  private static  repository = new PrismaUserRepository();

  static create(): UserRepository {
    return this.repository;
  }
}