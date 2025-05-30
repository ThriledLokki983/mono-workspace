// App-specific types for applications

import type { Environment, ThemeMode } from "../fe/base/base.js";

// Basic app state types
export interface AppState {
  // user: User | null;
  theme: ThemeMode;
  loading: boolean;
  error: string | null;
}

// Configuration types
export interface AppConfig {
  appName: string;
  version: string;
  environment: Environment;
  api: {
    baseUrl: string;
    timeout: number;
  };
}

// Loading states
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}
