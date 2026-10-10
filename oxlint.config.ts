import type { OxlintConfig } from 'vite-plus/lint';

export default {
  plugins: ['typescript', 'unicorn', 'oxc', 'promise', 'import'],
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
    // ===== 型 =====
    // anyの伝播防止
    'typescript/no-explicit-any': 'error',
    'typescript/no-unsafe-argument': 'error',
    'typescript/no-unsafe-assignment': 'error',
    'typescript/no-unsafe-call': 'error',
    'typescript/no-unsafe-member-access': 'error',
    'typescript/no-unsafe-return': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/ban-types': 'error',

    // 検査の厳格化
    'typescript/no-non-null-assertion': 'error',
    'typescript/ban-ts-comment': 'error',
    'unicorn/no-abusive-eslint-disable': 'error',
    'typescript/method-signature-style': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],

    // ===== 構文 =====
    // 変数
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-param-reassign': ['error', { props: true }],
    'init-declarations': 'error',
    'no-multi-assign': 'error',
    'no-return-assign': 'error',
    'unicorn/no-immediate-mutation': 'error',

    // 比較
    eqeqeq: 'error',
    'no-self-compare': 'error',

    // 暗黙の変換
    'no-implicit-coercion': 'error',
    'typescript/restrict-plus-operands': 'error',

    // switch
    'typescript/switch-exhaustiveness-check': 'error',
    'no-case-declarations': 'error',
    'default-case-last': 'error',

    // 例外
    'typescript/only-throw-error': 'error',

    // Promise
    'typescript/no-misused-promises': 'error',
    'typescript/require-await': 'error',
    'typescript/return-await': 'error',
    'typescript/prefer-promise-reject-errors': 'error',
    'typescript/use-unknown-in-catch-callback-variable': 'error',
    'no-promise-executor-return': 'error',

    // ===== スタイル =====
    // 型
    'typescript/consistent-type-definitions': ['error', 'type'],
    'typescript/array-type': ['error', { default: 'array' }],
    'typescript/consistent-indexed-object-style': 'error',
    'typescript/prefer-function-type': 'error',
    'typescript/no-inferrable-types': 'error',
    'typescript/consistent-generic-constructors': 'error',
    'typescript/prefer-reduce-type-parameter': 'error',
    'typescript/dot-notation': 'error',

    // import / export
    'typescript/consistent-type-exports': 'error',
    'unicorn/prefer-node-protocol': 'error',
    'unicorn/prefer-export-from': 'error',

    // ファイル名
    'unicorn/filename-case': ['error', { case: 'kebabCase' }],

    // 文字列と数値
    'prefer-template': 'error',
    'no-template-curly-in-string': 'error',
    'unicorn/prefer-string-replace-all': 'error',
    'unicorn/prefer-string-slice': 'error',
    'typescript/prefer-string-starts-ends-with': 'error',
    'unicorn/numeric-separators-style': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/no-zero-fractions': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-exponentiation-operator': 'error',
    'unicorn/prefer-number-properties': 'error',
    'unicorn/prefer-math-trunc': 'error',
    'unicorn/prefer-math-min-max': 'error',

    // 配列とオブジェクト
    'unicorn/no-array-for-each': 'error',
    'typescript/prefer-includes': 'error',
    'unicorn/prefer-at': 'error',
    'unicorn/prefer-array-some': 'error',
    'unicorn/prefer-array-flat': 'error',
    'unicorn/prefer-array-index-of': 'error',
    'unicorn/prefer-negative-index': 'error',
    'typescript/prefer-find': 'error',
    'typescript/prefer-for-of': 'error',
    'object-shorthand': 'error',
    'prefer-object-spread': 'error',
    'prefer-spread': 'error',
    'prefer-rest-params': 'error',
    'prefer-object-has-own': 'error',
    'unicorn/prefer-object-from-entries': 'error',
    'unicorn/prefer-structured-clone': 'error',
    'no-useless-computed-key': 'error',

    // 制御の流れ
    'no-else-return': 'error',
    'no-useless-return': 'error',
    'no-lonely-if': 'error',
    'no-lone-blocks': 'error',
    'no-empty': 'error',
    'arrow-body-style': 'error',
    yoda: 'error',
    'default-param-last': 'error',
    'guard-for-in': 'error',

    // 古いスタイル
    'no-array-constructor': 'error',
    'no-new-wrappers': 'error',
    'no-object-constructor': 'error',
    'no-new-func': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-typeof-undefined': 'error',
    'unicorn/no-instanceof-array': 'error',
    'unicorn/prefer-date-now': 'error',

    // エラー
    'unicorn/throw-new-error': 'error',
    'unicorn/error-message': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/prefer-optional-catch-binding': 'error',

    // ===== その他 =====
    'typescript/no-confusing-void-expression': 'error',
    'typescript/strict-void-return': 'error',
    'typescript/no-deprecated': 'error',
    'typescript/no-dynamic-delete': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-invalid-void-type': 'error',
    'typescript/prefer-nullish-coalescing': 'error',
    radix: 'error',
    'no-prototype-builtins': 'error',

    // カテゴリで有効になるルールのうち使わないもの
    'no-unreachable': 'off', // tsconfigのallowUnreachableCodeで検出
    'no-unused-labels': 'off', // tsconfigのallowUnusedLabelsで検出
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
} satisfies OxlintConfig;
