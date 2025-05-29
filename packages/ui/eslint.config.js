import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactConfig from '@mono/eslint-config-custom/react';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...reactConfig,
  }
);
