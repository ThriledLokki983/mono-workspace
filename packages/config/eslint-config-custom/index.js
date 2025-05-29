import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default {
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
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

    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'arrow-body-style': ['error', 'as-needed'],
  },
  ignores: ['dist', 'build', 'node_modules', '*.min.js', 'coverage'],
};
