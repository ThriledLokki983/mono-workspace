// Common shared types for the entire monorepo

// Base types
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

// User-related types (basic - only what might be used)
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
}

// API Response types (basic)
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  code: number;
  details?: Record<string, any>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Environment types
export type Environment = "development" | "staging" | "production";

// Theme types (basic)
export type ThemeMode = "light" | "dark" | "system";

// Export UI types
export * from "./ui/index.js";
