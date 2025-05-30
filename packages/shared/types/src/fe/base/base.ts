// Common shared types for the entire monorepo

// Base types
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Environment types
export type Environment = "development" | "staging" | "production";

// Theme types (basic)
export type ThemeMode = "light" | "dark" | "system";
