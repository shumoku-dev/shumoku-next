import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    ignorePatterns: ['notes/**', '.agents/**', '.claude/**', '.codex/**', '*.md'],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
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
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  run: {
    cache: true,
  },
});
