import js from '@eslint/js';
import reactConfig from '@mono-workspace/eslint-config-custom/react';

export default [
  { ignores: ['dist'] },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...reactConfig,
  },
];
