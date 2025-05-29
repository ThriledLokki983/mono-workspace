import type { User, Environment, ThemeMode } from "./index.js";
export interface AppState {
  user: User | null;
  theme: ThemeMode;
  loading: boolean;
  error: string | null;
}
export interface AppConfig {
  appName: string;
  version: string;
  environment: Environment;
  api: {
    baseUrl: string;
    timeout: number;
  };
}
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";
export interface AsyncState<T = any> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}
export type {
  User,
  ApiResponse,
  ApiError,
  Environment,
  ThemeMode,
} from "./index.js";
//# sourceMappingURL=app.d.ts.map
