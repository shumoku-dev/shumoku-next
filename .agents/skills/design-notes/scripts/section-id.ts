// 設計メモの見出しに振る ID（16 進 8 桁）を発行し、検査する。
// ID は見出しの直前の行に <!-- id: xxxxxxxx --> と書き、ref:xxxxxxxx で参照する。
//
//   node .agents/skills/design-notes/scripts/section-id.ts new [個数]
//   node .agents/skills/design-notes/scripts/section-id.ts check

import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

const REFERENCE = "ref:[0-9a-f]{8}";
const DEFINITION = /^<!-- id: ([0-9a-f]{8}) -->$/;
const HEADING = /^#{2,6} /;
const FENCE = /^(```|~~~)/;
const HEADINGS_WITHOUT_ID = new Set(["## 目次"]);

// git grep は一致がないと 1 で終了する。
const git = (...args: readonly string[]): readonly string[] => {
  try {
    return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
      .split("\n")
      .filter((line) => line !== "");
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 1) return [];
    throw error;
  }
};

// 作業ツリーと、すべてのローカルブランチにある ID。別のブランチで発行した ID とも衝突させない。
const usedIds = (): ReadonlySet<string> => {
  const pattern = `(id: |ref:)[0-9a-f]{8}`;
  const branches = git("for-each-ref", "--format=%(refname)", "refs/heads");
  return new Set(
    [
      ...git("grep", "-hoE", "--untracked", "-e", pattern),
      ...(branches.length === 0 ? [] : git("grep", "-hoE", "-e", pattern, ...branches, "--")),
    ].map((match) => match.slice(-8)),
  );
};

const newIds = (count: number, used: ReadonlySet<string>): readonly string[] => {
  if (count === 0) return [];
  const id = randomBytes(4).toString("hex");
  if (used.has(id)) return newIds(count, used);
  return [id, ...newIds(count - 1, new Set([...used, id]))];
};

type Line = { readonly location: string; readonly text: string };

// コードブロックの外の行を、前後の行を見られるように並べて返す。コードブロックの行は空行にする。
const linesOf = (file: string): readonly Line[] =>
  readFileSync(file, "utf8")
    .split("\n")
    .reduce<{ readonly inFence: boolean; readonly lines: readonly Line[] }>(
      (state, text, index) => {
        const isFence = FENCE.test(text);
        const line = {
          location: `${file}:${index + 1}`,
          text: state.inFence || isFence ? "" : text,
        };
        return { inFence: state.inFence !== isFence, lines: [...state.lines, line] };
      },
      { inFence: false, lines: [] },
    ).lines;

const idOf = (line: Line | undefined): string | undefined => line?.text.match(DEFINITION)?.[1];

const isHeading = (line: Line | undefined): boolean =>
  line !== undefined && HEADING.test(line.text) && !HEADINGS_WITHOUT_ID.has(line.text);

const check = (): readonly string[] => {
  const files = git("ls-files", "-co", "--exclude-standard", "--", "notes/*.md").map(linesOf);
  const definitions = Map.groupBy(
    files.flatMap((lines) =>
      lines.flatMap((line) => {
        const id = idOf(line);
        return id === undefined ? [] : [{ id, location: line.location }];
      }),
    ),
    (definition) => definition.id,
  );
  return [
    ...files.flatMap((lines) =>
      lines.flatMap((line, index) => [
        ...(isHeading(line) && idOf(lines[index - 1]) === undefined
          ? [`${line.location}: 見出しの直前の行に ID がない: ${line.text}`]
          : []),
        ...(idOf(line) !== undefined && !isHeading(lines[index + 1])
          ? [`${line.location}: ID の次の行が見出しでない`]
          : []),
      ]),
    ),
    ...[...definitions]
      .filter(([, found]) => found.length > 1)
      .map(
        ([id, found]) =>
          `${id}: 複数の見出しに振られている: ${found.map((definition) => definition.location).join(", ")}`,
      ),
    ...git("grep", "-noE", "--untracked", "-e", REFERENCE)
      .filter((match) => !definitions.has(match.slice(-8)))
      .map((match) => `${match}: この ID の見出しがない`),
  ];
};

const [command, argument] = process.argv.slice(2);

if (command === "new") {
  const count = Number(argument ?? "1");
  if (!Number.isInteger(count) || count < 1) {
    console.error("個数は 1 以上の整数で指定する");
    process.exit(2);
  }
  console.log(newIds(count, usedIds()).join("\n"));
} else if (command === "check") {
  const problems = check();
  if (problems.length > 0) {
    console.error(problems.join("\n"));
    process.exit(1);
  }
} else {
  console.error("使い方: section-id.ts new [個数] | check");
  process.exit(2);
}
