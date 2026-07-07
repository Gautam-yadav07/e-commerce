import type { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedUser extends JwtPayload {
  id: string;
  email: string;
  role: 'customer' | 'admin'|'seller';
}

declare global {
  namespace Express {
    interface Request {
      user: AuthenticatedUser; 
    }
  }
}
