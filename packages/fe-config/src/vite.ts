import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ViteConfigOptions {
  appName: string;
  port?: number;
  additionalAliases?: Record<string, string>;
  additionalOptimizeDeps?: string[];
}

export function createViteConfig(options: ViteConfigOptions): UserConfig {
  const {
    appName,
    port = 3000,
    additionalAliases = {},
    additionalOptimizeDeps = [],
  } = options;

  return defineConfig({
    plugins: [react()],
    server: {
      port,
      host: true,
      open: true,
      fs: {
        // Allow serving files from the monorepo root
        allow: ["../../.."],
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      commonjsOptions: {
        include: [/node_modules/, /packages/],
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            "react-query": ["@tanstack/react-query"],
            "react-router": ["react-router", "react-router-dom"],
            "lucide-react": ["lucide-react"],
            "react-aria": ["react-aria-components"],
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(process.cwd(), "src"),
        "@mono/components": resolve(
          __dirname,
          "../../../packages/components/index.tsx"
        ),
        "@mono/styles": resolve(__dirname, "../../../packages/styles/src"),
        "@mono/types": resolve(__dirname, "../../../packages/types/src"),
        "@mono/fe-config": resolve(
          __dirname,
          "../../../packages/fe-config/src"
        ),
        ...additionalAliases,
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@tanstack/react-query",
        "react-router",
        "react-router-dom",
        "lucide-react",
        "react-aria-components",
        "open-props",
        ...additionalOptimizeDeps,
      ],
      // Exclude local workspace packages
      exclude: [
        "@mono/components",
        "@mono/styles",
        "@mono/types",
        "@mono/fe-config",
      ],
    },
    css: {
      modules: {
        // Enable CSS modules for .module.css, .module.scss files
        localsConvention: "camelCaseOnly",
        generateScopedName: "[name]__[local]___[hash:base64:5]",
      },
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          additionalData: `
            @use "sass:color";
            @use "sass:math";
            @use "base-styles" as *;
          `,
          loadPaths: [
            resolve(__dirname, "../../../packages/styles/src"),
            resolve(__dirname, "../../../node_modules"),
          ],
        },
      },
    },
    define: {
      __APP_NAME__: JSON.stringify(appName),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  });
}
