import type { OxfmtConfig } from 'vite-plus/fmt';

export default {
  singleQuote: true,
  sortImports: true,
  ignorePatterns: ['notes/**', '.agents/**', '.claude/**', '.codex/**', '*.md'],
} satisfies OxfmtConfig;
