import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mono/ui'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /node_modules/],
    },
  },
  resolve: {
    alias: {
      '@mono/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
});
