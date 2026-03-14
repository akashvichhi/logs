import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // ── TypeScript ────────────────────────────────────────────────
      '@typescript-eslint/no-unused-vars':       ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-use-before-define': ['error'],
      'no-unused-vars':                          'off', // use @typescript-eslint version instead
      'no-use-before-define':                    'off', // use @typescript-eslint version instead

      // ── Imports ───────────────────────────────────────────────────
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
      ],
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export':      'off',
      'import/no-unresolved':              'off',
      // Disallow deep relative imports like ../../
      'import/no-relative-parent-imports': 'off', // handled by no-restricted-imports below
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group:   ['../../*'],
              message: 'Imports going more than one level up (../../) are not allowed. Restructure your code or use path aliases.',
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          'alphabetize': {
            order:           'asc',
            caseInsensitive: true,
          },
          // parent (../) appears before sibling (./) in its own group
          'groups':           ['builtin', 'external', 'internal', 'parent', 'sibling', 'unknown'],
          'newlines-between': 'always',
          'pathGroups': [
            {
              pattern: '{react,react-dom}',
              group:   'builtin',
            },
            {
              pattern:  '@src/!(components)/**/!(*.scss|*.css)',
              group:    'internal',
            },
            {
              pattern:  '@src/components/**/!(*.scss|*.css)',
              group:    'internal',
              position: 'after',
            },
            {
              pattern:  '**/*.{scss,css}',
              group:    'object',
              position: 'after',
            },
          ],
          'pathGroupsExcludedImportTypes': ['{react,react-dom}'],
          'warnOnUnassignedImports':       true,
        },
      ],

      // ── React ─────────────────────────────────────────────────────
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-curly-spacing':             ['error', { when: 'always' }],
      'react/jsx-filename-extension':        ['error', { extensions: ['.jsx', '.tsx'] }],
      'react/jsx-props-no-spreading':        'off',
      // Enforce boolean props shorthand: use isOpen instead of isOpen={true}
      'react/jsx-boolean-value':             ['error', 'never'],
      'react/jsx-sort-props': [
        'error',
        {
          // Sort all props alphabetically
          // Shorthand boolean props (isOpen) come before callbacks (onClick)
          // Callbacks (on*) come last
          // Reserved props (key, ref) come first
          ignoreCase:      true,
          callbacksLast:   true,
          shorthandFirst:  true,
          shorthandLast:   false,
          reservedFirst:   true,
          noSortAlphabetically: false,
        },
      ],
      'react/prop-types':            'off',
      'react/require-default-props': 'off',
      'react-hooks/exhaustive-deps': ['warn'],

      // ── jsx-a11y ──────────────────────────────────────────────────
      'jsx-a11y/anchor-is-valid':                        'off',
      'jsx-a11y/click-events-have-key-events':           'off',
      'jsx-a11y/label-has-associated-control':           ['error', { assert: 'either' }],
      'jsx-a11y/no-noninteractive-element-interactions': 'off',

      // ── General ───────────────────────────────────────────────────
      'arrow-body-style':     'off',
      'key-spacing':          ['error', { align: 'value' }],
      'no-param-reassign':    ['error', { props: false }],
      'object-curly-newline': ['error', { consistent: true }],
      'operator-linebreak':   ['error', 'before', { overrides: { '=': 'after' } }],
      'prefer-destructuring': ['error', { array: false }],
      'no-restricted-exports': 'off',
      'quote-props':          ['error', 'consistent-as-needed'],
      'max-len':              ['error', { code: 120 }],
      'linebreak-style':      ['error', 'unix'],
    },
  },
])
