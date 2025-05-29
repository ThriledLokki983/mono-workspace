import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: globals.browser,
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    import: importPlugin,
  },
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-inferrable-types': 'error',

    // Dependency constraints for monorepo
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Prevent apps from importing other apps
          {
            target: './apps/faithcirce/**/*',
            from: './apps/huishelder/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          {
            target: './apps/faithcirce/**/*',
            from: './apps/test-app/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          {
            target: './apps/huishelder/**/*',
            from: './apps/faithcirce/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          {
            target: './apps/huishelder/**/*',
            from: './apps/test-app/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          {
            target: './apps/test-app/**/*',
            from: './apps/faithcirce/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          {
            target: './apps/test-app/**/*',
            from: './apps/huishelder/**/*',
            message:
              'Apps should not import from other apps. Use shared packages instead.',
          },
          // Prevent packages from importing apps
          {
            target: './packages/**/*',
            from: './apps/**/*',
            message:
              'Packages should not import from apps. Keep packages independent and reusable.',
          },
        ],
      },
    ],

    // React Hooks rules
    ...reactHooks.configs.recommended.rules,

    // React Refresh rules (for development)
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'arrow-body-style': ['error', 'as-needed'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignores: ['dist', 'build', 'node_modules', '*.min.js', 'coverage'],
};
