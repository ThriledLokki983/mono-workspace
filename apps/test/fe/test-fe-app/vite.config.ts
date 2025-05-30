import { createViteConfig } from '@mono/config/vite';

export default createViteConfig({
  appName: 'test-app',
  port: 3000,
  additionalAliases: {
    // Add any app-specific aliases here
  },
  additionalOptimizeDeps: [
    'open-props',
    // Add any app-specific dependencies to optimize here
  ],
});
