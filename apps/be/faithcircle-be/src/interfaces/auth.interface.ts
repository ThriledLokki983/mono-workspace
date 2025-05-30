import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string;
  iat?: number; // Issued at timestamp
  nbf?: number; // Not before timestamp
  exp?: number; // Expiration timestamp
  iss?: string; // Issuer
  aud?: string; // Audience
  sub?: string; // Subject (user ID)
  role?: string; // User role for RBAC
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
  token?: string; // Add token to store the JWT during logout
}
