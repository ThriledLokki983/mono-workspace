export type ID = string | number;
export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
}
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
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type Environment = "development" | "staging" | "production";
export type ThemeMode = "light" | "dark" | "system";
export * from "./ui/index.js";
//# sourceMappingURL=index.d.ts.map
