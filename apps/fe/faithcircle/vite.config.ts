import { createViteConfig } from '@mono/fe-config/vite';

export default createViteConfig({
  appName: 'faithcircle',
  port: 3000,
  additionalAliases: {
    // Add any app-specific aliases here
  },
  additionalOptimizeDeps: [
    'open-props',
    // Add any app-specific dependencies to optimize here
  ],
});
