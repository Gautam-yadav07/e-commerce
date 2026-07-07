import type { UserCreatedResponse, UserInput } from "../types/authTypes.js";


export interface UserRepository {
  createUser(user: UserInput): Promise<UserCreatedResponse>;
  // updateUserRole(userId: number, roleId: number): Promise<void>;
}


