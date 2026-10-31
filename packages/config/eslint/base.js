import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Flutter demo builds are generated into the site's public folder.
  {
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/.next/**',
      '**/next-env.d.ts',
      '**/public/flutter/demos/**',
      // The assembled end-to-end build and Playwright's reports.
      '**/.dist/**',
      '**/test-results/**',
      '**/playwright-report/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: { projectService: true },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // Allows `onClick={() => setOpen(true)}`, the idiomatic React handler shorthand.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  prettier,
)
