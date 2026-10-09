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
