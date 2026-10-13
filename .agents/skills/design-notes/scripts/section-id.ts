// 設計メモの見出しに振る ID（16 進 8 桁）を発行し、検査する。
// ID は見出しの直前の行に <!-- id:xxxxxxxx --> と書き、ref:xxxxxxxx で参照する。
//
//   node .agents/skills/design-notes/scripts/section-id.ts new [個数]
//   node .agents/skills/design-notes/scripts/section-id.ts check

import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

import { Val } from "valof";
import { Enum } from "valof/experimental";

const HEADINGS_WITHOUT_ID = new Set(["## 目次"]);

type SectionId = Val<"SectionId", string>;
const SectionId = Val.companion<SectionId>()
  .implCreate(() => randomBytes(4).toString("hex"))
  .implSeal((text, seal): SectionId | undefined =>
    /^[0-9a-f]{8}$/.test(text) ? seal(text) : undefined,
  );

// 既存の ID と衝突しない ID を count 個発行する。
const mintIds = (used: ReadonlySet<SectionId>, count: number): readonly SectionId[] => {
  if (count === 0) return [];
  const id = SectionId.create();
  if (id === undefined || used.has(id)) return mintIds(used, count);
  return [id, ...mintIds(new Set([...used, id]), count - 1)];
};

// コードブロックの中の行は、text を空にして持つ。
type Line = Val<"Line", { file: string; number: number; text: string }>;
const Line = Val.sealer<Line>().impl({
  location(line): string {
    return `${line.file}:${line.number}`;
  },
  isHeading(line): boolean {
    return /^#{2,6} /.test(line.text) && !HEADINGS_WITHOUT_ID.has(line.text);
  },
  // <!-- id:xxxxxxxx --> の行が定義する ID。
  definedId(line): SectionId | undefined {
    const id = /^<!-- id:([0-9a-f]{8}) -->$/.exec(line.text)?.[1];
    return id === undefined ? undefined : SectionId.seal(id);
  },
});

type Problem = Enum<
  "Problem",
  {
    HeadingWithoutId: { heading: Line };
    IdWithoutHeading: { definition: Line };
    DuplicateId: { id: SectionId; definitions: Line[] };
    UnknownReference: { match: string };
  }
>;
const Problem = Enum.sealer<Problem>().impl({
  message(problem): string {
    return Problem.match(problem, {
      HeadingWithoutId: ({ heading }) =>
        `${Line.location(heading)}: 見出しの直前の行に ID がない: ${heading.text}`,
      IdWithoutHeading: ({ definition }) =>
        `${Line.location(definition)}: ID の次の行が見出しでない`,
      DuplicateId: ({ id, definitions }) =>
        `${id}: 複数の見出しに振られている: ${definitions.map(Line.location).join(", ")}`,
      UnknownReference: ({ match }) => `${match}: この ID の見出しがない`,
    });
  },
});

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

// git grep -o の出力の末尾 8 文字を ID として読む。
const idAtEnd = (match: string): readonly SectionId[] => {
  const id = SectionId.seal(match.slice(-8));
  return id === undefined ? [] : [id];
};

// 作業ツリーと、すべてのローカルブランチにある ID。別のブランチで発行した ID とも衝突させない。
const usedIds = (): ReadonlySet<SectionId> => {
  const pattern = `(id|ref):[0-9a-f]{8}`;
  const branches = git("for-each-ref", "--format=%(refname)", "refs/heads");
  return new Set(
    [
      ...git("grep", "-hoE", "--untracked", "-e", pattern),
      ...(branches.length === 0 ? [] : git("grep", "-hoE", "-e", pattern, ...branches, "--")),
    ].flatMap(idAtEnd),
  );
};

const linesOf = (file: string): readonly Line[] =>
  readFileSync(file, "utf8")
    .split("\n")
    .reduce<{ readonly inFence: boolean; readonly lines: readonly Line[] }>(
      (state, text, index) => {
        const isFence = /^(```|~~~)/.test(text);
        const line = Line({ file, number: index + 1, text: state.inFence || isFence ? "" : text });
        return { inFence: state.inFence !== isFence, lines: [...state.lines, line] };
      },
      { inFence: false, lines: [] },
    ).lines;

const check = (): readonly Problem[] => {
  const files = git("ls-files", "-co", "--exclude-standard", "--", "notes/*.md").map(linesOf);
  const definitions = Map.groupBy(
    files.flat().filter((line) => Line.definedId(line) !== undefined),
    Line.definedId,
  );
  return [
    ...files.flatMap((lines) =>
      lines.flatMap((line, index) => {
        const previous = lines[index - 1];
        const next = lines[index + 1];
        return [
          ...(Line.isHeading(line) && (previous === undefined || Line.definedId(previous) === undefined)
            ? [Problem.HeadingWithoutId({ heading: line })]
            : []),
          ...(Line.definedId(line) !== undefined && (next === undefined || !Line.isHeading(next))
            ? [Problem.IdWithoutHeading({ definition: line })]
            : []),
        ];
      }),
    ),
    ...[...definitions].flatMap(([id, found]) =>
      id !== undefined && found.length > 1 ? [Problem.DuplicateId({ id, definitions: found })] : [],
    ),
    ...git("grep", "-noE", "--untracked", "-e", "ref:[0-9a-f]{8}")
      .filter((match) => !idAtEnd(match).some((id) => definitions.has(id)))
      .map((match) => Problem.UnknownReference({ match })),
  ];
};

type Command = Enum<
  "Command",
  {
    New: { count: number };
    Check: Record<never, never>;
    Invalid: { message: string };
  }
>;
const Command = Enum.sealer<Command>().impl({
  // 終了コードを返す。
  run(command): number {
    return Command.match(command, {
      New: ({ count }) => {
        console.log(mintIds(usedIds(), count).join("\n"));
        return 0;
      },
      Check: () => {
        const problems = check();
        if (problems.length === 0) return 0;
        console.error(problems.map(Problem.message).join("\n"));
        return 1;
      },
      Invalid: ({ message }) => {
        console.error(message);
        return 2;
      },
    });
  },
});

const parseCommand = ([name, argument]: readonly string[]): Command => {
  if (name === "check") return Command.Check({});
  if (name !== "new") return Command.Invalid({ message: "使い方: section-id.ts new [個数] | check" });
  const count = Number(argument ?? "1");
  return Number.isInteger(count) && count >= 1
    ? Command.New({ count })
    : Command.Invalid({ message: "個数は 1 以上の整数で指定する" });
};

process.exitCode = Command.run(parseCommand(process.argv.slice(2)));
