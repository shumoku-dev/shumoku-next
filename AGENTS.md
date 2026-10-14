# shumoku-next

このリポジトリでは、[konoe-akitoshi/shumoku](https://github.com/konoe-akitoshi/shumoku) を完全にリライトする。成果物はShumoku v1.0.0としてリリースすることを目指す。

## 設計メモ

- `notes/design.md`: 設計判断と検討の過程で却下した案を記録する。冒頭に目次がある。設計を始める前に関連するトピックを読むこと。
- `notes/open-questions.md`: 検討中のトピックや判断を保留しているトピックを記録する。

設計メモを書く前に `.agents/skills/design-notes/SKILL.md` を読み、そのルールに従う。

## テスト

`.agents/skills/test-audit/SKILL.md` を使ってテストを監査する。

- 不要・重複するテスト、変更された振る舞いのテスト漏れ、実装が壊れても通るテストを報告する。
- 監査はテストを書いたエージェントとは別のエージェントに、ユーザーが選んだモデルで実行させる。
- 指摘の修正はユーザーの明示的な指示を受けてから行う。

## コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) の形式に従う。タイトルの `:` 以降と本文は日本語で書く。タイトルは体言止めを基本とする。

例：`feat(layout): ポートの自動配置を追加`

`notes/` は内部用のメモなので、その変更には `docs` ではなく `notes` を type に使う。`docs` は README など利用者向けのドキュメントの変更に使う。

例：`notes: アイコンの SVG を画像として埋め込む判断を記録`

`AGENTS.md` や `.agents/` など、エージェント向けの指示の変更には `agents` を type に使う。

例：`agents: テスト監査スキルを追加`

本文は基本的に書かず、diff から意図が読み取れない場合だけ書く。本文を書く場合、箇条書きでなるべく短く書く。各項目は基本的に体言止めにするが、終止形も使用可。

Renovate などの bot が作るコミットは、英語でもよい。

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
