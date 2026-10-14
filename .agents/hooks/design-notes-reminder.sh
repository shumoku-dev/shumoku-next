#!/bin/sh
# notes/ 以下の Markdown を編集する前に、設計メモの書き方の skill を読むよう促す。
# Claude Code は file_path を、Codex は apply_patch のパッチ本文を stdin に渡す。
grep -Eq '"file_path" *: *"[^"]*/notes/[^"]*\.md"|\*\*\* (Add|Update|Delete) File: (.+/)?notes/[^"[:space:]\\]+\.md' || exit 0

cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"設計メモを編集しようとしている。まだ読んでいなければ、先に .agents/skills/design-notes/SKILL.md を読み、そのルール（目次の整合性、節の独立性、見出しの使い方、却下と再評価の書き方）に従うこと。"}}
JSON
