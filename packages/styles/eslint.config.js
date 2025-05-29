import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import baseConfig from '@mono/eslint-config-custom';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    ...baseConfig,
  }
);
