
 export interface UserInput {
  name: string;
  email: string;
}

export interface UserCreatedResponse {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}
export interface UserRepository {
  createUser(user: UserInput): Promise<UserCreatedResponse>;
  // updateUserRole(userId: number, roleId: number): Promise<void>;
}


