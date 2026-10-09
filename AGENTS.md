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

本文は基本的に書かず、diff から意図が読み取れない場合だけ書く。本文を書く場合、箇条書きでなるべく短く書く。各項目は基本的に体言止めにするが、終止形も使用可。
