import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

/**
 * Shared ESLint flat config for all VisKit packages.
 *
 * Usage in a package's eslint.config.js:
 *   import { baseConfig } from '@viskit/eslint-config';
 *   export default [...baseConfig];
 */
export const baseConfig = [
  { ignores: ['dist', 'node_modules', '*.config.*'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Enforce no `any` — use `unknown` instead
      '@typescript-eslint/no-explicit-any': 'error',
      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
];
