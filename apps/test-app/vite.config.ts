import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // Enable CSS modules for .module.css, .module.scss files
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        loadPaths: [
          path.resolve(__dirname, '../../packages/styles/src'),
          path.resolve(__dirname, '../../node_modules'),
          path.resolve(__dirname, '../../node_modules'),
        ],
        additionalData: `
          @use "sass:color";
          @use "sass:math";
        `,
      },
    },
  },
  optimizeDeps: {
    include: ['@mono/ui', 'open-props'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /packages/],
    },
  },
  resolve: {
    alias: {
      '@mono/ui': path.resolve(
        __dirname,
        '../../packages/components/index.tsx'
      ),
      '@mono/types': path.resolve(__dirname, '../../packages/types/src'),
      '@mono/styles': path.resolve(__dirname, '../../packages/styles/src'),
    },
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
});
