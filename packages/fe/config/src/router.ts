import { createBrowserRouter, type RouteObject } from "react-router-dom";

export interface RouterConfig {
  routes: RouteObject[];
  basename?: string;
}

export function createAppRouter(config: RouterConfig) {
  return createBrowserRouter(config.routes, {
    basename: config.basename,
  });
}

// Common route utilities
export const routeUtils = {
  createProtectedRoute: (
    element: React.ReactElement,
    isAuthenticated: boolean,
  ) => {
    if (!isAuthenticated) {
      // You can customize this redirect logic
      throw new Response("Unauthorized", { status: 401 });
    }
    return element;
  },

  createErrorBoundaryRoute: (
    element: React.ReactElement,
    errorElement?: React.ReactElement,
  ) => ({
    element,
    errorElement: errorElement || (() => "Something went wrong!")(),
  }),
} as const;
