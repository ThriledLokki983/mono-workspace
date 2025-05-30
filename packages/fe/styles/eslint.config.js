import js from '@eslint/js';
import baseConfig from '@mono/eslint-config-custom';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    ...baseConfig,
  },
];
