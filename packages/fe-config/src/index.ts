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
): AppConfig => {
  // Helper function to safely access import.meta.env
  const getEnvValue = (key: string, fallback: string) => {
    if (typeof import.meta !== "undefined" && "env" in import.meta) {
      const env = (import.meta as { env: Record<string, unknown> }).env;
      return (env[key] as string) || fallback;
    }
    return fallback;
  };

  return {
    name: "Frontend App",
    version: "1.0.0",
    environment: getEnvValue("MODE", "development") as AppConfig["environment"],
    apiBaseUrl: getEnvValue("VITE_API_BASE_URL", "http://localhost:8000"),
    ...overrides,
  };
};

// Environment utilities with proper typing
export const isDevelopment = () => {
  if (typeof import.meta !== "undefined" && "env" in import.meta) {
    return (
      (import.meta as { env: Record<string, unknown> }).env.MODE ===
      "development"
    );
  }
  return false;
};

export const isProduction = () => {
  if (typeof import.meta !== "undefined" && "env" in import.meta) {
    return (
      (import.meta as { env: Record<string, unknown> }).env.MODE ===
      "production"
    );
  }
  return false;
};

export const isStaging = () => {
  if (typeof import.meta !== "undefined" && "env" in import.meta) {
    return (
      (import.meta as { env: Record<string, unknown> }).env.MODE === "staging"
    );
  }
  return false;
};
