import js from '@eslint/js';
import baseConfig from '@mono/eslint-config-custom';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    ...baseConfig,
  },
];
