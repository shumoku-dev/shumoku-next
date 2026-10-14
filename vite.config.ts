import { configDefaults, defineConfig } from "vite-plus";

import fmt from "./oxfmt.config";
import lint from "./oxlint.config";

export default defineConfig({
  fmt,
  lint,
  test: {
    // 依存が変わったら、CI の --changed でもすべてのテストを実行する。
    forceRerunTriggers: [...configDefaults.forceRerunTriggers, "**/pnpm-lock.yaml"],
  },
  staged: {
    "*": "vp check --fix",
  },
  run: {
    cache: true,
    tasks: {
      check: "vp check",
      test: "vp test --passWithNoTests",
      knip: {
        command: "knip",
        // knip が設定を読むときに jiti が書くキャッシュを入力から外す。
        // 外さないと、node_modules を入れ直した直後の実行がキャッシュされない。
        cache: { input: [{ auto: true }, "!node_modules/.cache/**"] },
      },
      "design-notes": "node .agents/skills/design-notes/scripts/section-id.ts check",
    },
  },
});
