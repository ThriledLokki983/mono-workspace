// Re-export common frontend utilities
export { createViteConfig, type ViteConfigOptions } from "./vite";
export {
  createQueryClient,
  queryKeys,
  type QueryClientOptions,
} from "./query-client";
export { createAppRouter, routeUtils, type RouterConfig } from "./router";

// Common frontend types and utilities
export interface AppConfig {
  name: string;
  version: string;
  environment: "development" | "staging" | "production";
  apiBaseUrl: string;
}

export const createAppConfig = (
  overrides: Partial<AppConfig> = {}
): AppConfig => ({
  name: "Frontend App",
  version: "1.0.0",
  environment:
    ((import.meta as any).env?.MODE as AppConfig["environment"]) ||
    "development",
  apiBaseUrl:
    (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8000",
  ...overrides,
});

// Environment utilities
export const isDevelopment = () =>
  (import.meta as any).env?.MODE === "development";
export const isProduction = () =>
  (import.meta as any).env?.MODE === "production";
export const isStaging = () => (import.meta as any).env?.MODE === "staging";
