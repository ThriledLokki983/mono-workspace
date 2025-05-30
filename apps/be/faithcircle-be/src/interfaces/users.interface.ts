export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ADVISOR = 'advisor',
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  language_preference: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  is_active: boolean;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: UserRole;
  language_preference: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface UserCredentials {
  email: string;
  password: string;
}
