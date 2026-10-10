import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    ignorePatterns: ['notes/**', '.agents/**', '.claude/**', '.codex/**', '*.md'],
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'promise'],
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
    },
    categories: {
      suspicious: 'warn',
      perf: 'warn',
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // tsconfigのallowUnreachableCodeとallowUnusedLabelsで検出
      'no-unreachable': 'off',
      'no-unused-labels': 'off',

      'typescript/no-non-null-assertion': 'error',

      'no-await-in-loop': 'off',
      'no-shadow': 'off',
      'no-underscore-dangle': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
    overrides: [
      {
        files: ['**/*.test.ts'],
        plugins: ['vitest'],
      },
    ],
  },
  staged: {
    '*': 'vp check --fix',
  },
  run: {
    cache: true,
  },
});
