import babelParser from '@babel/eslint-parser'
import reactHooks from 'eslint-plugin-react-hooks'
import i18next from 'eslint-plugin-i18next'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'public/**', 'coverage/**'],
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          parserOpts: { plugins: ['typescript'] },
        },
      },
    },
    // Oxlint handles type-aware rules; Babel parses TypeScript for ESLint plugins.
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
    },
  },
  {
    files: ['**/*.tsx'],
    languageOptions: {
      parserOptions: {
        babelOptions: {
          parserOpts: { plugins: ['typescript', 'jsx'] },
        },
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      i18next,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      // Make prettier code formatting suggestions more verbose.
      'prettier/prettier': 'warn',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-console': 'off',
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: true,
          ignore: [
            'button',
            'numberOfBanners',
            '_blank',
            'sequential',
            'anyOrder',
            '/.*',
            'start',
            'right',
            'top',
            'center',
            'info',
            '\\w+Pane',
            'poi',
            '#[0-9ABCDEF]+',
            'currentColor',
            'longName',
            'formattedAddress',
          ],
        },
      ],
    },
  },
]
