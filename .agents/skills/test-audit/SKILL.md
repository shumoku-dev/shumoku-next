---
name: test-audit
description:
  Audit what each test guarantees. It reports tests to delete or merge, behaviour changed with no
  test covering it, and tests that cannot fail. Use it when asked to audit tests.
---

# Test audit

One pass over the tests, separate from writing them. Report findings; apply them only on a go-ahead.

The question every finding answers: **which realistic bug reaches a user if this test is gone?** A
test that answers nothing costs run time, flakiness and edits on every refactor, and buys nothing.
Test count and coverage percentage are not the goal.

## Scope

By default, the changes since the last audit on this branch, uncommitted ones included:

```sh
git diff <last audited commit>
```

With no record, or when a rebase dropped the recorded commit from the history, use
`git diff main...HEAD` plus `git diff HEAD` for uncommitted changes.

The user can name another scope instead: a commit range, a file, or `all` for the whole suite.

## Record

Each audit leaves a record for the next one, at
`$(git rev-parse --git-path test-audit)/<branch>.md`. It sits in the git directory, so it is never
committed. A branch name with `/` puts it in a subdirectory, so create the directory first.
Overwrite the file after each audit:

```markdown
commit: <HEAD at the audit>
date: <YYYY-MM-DD>
scope: <the diff command used>
model: <the model and reasoning effort the audit ran on>

<the report>

## Decisions

- <file:line>: fixed | declined, <the user's reason>
```

Fill in Decisions once the user answers. Carry declined findings over from the previous record
while the code they point at is unchanged.

Before an audit, read the record. Hand the audit agent the declined findings so it does not raise
them again unless the code changed.

Move `commit` forward only when the audit covered everything since the previous record. An audit of
a narrower scope the user named leaves `commit` as it was.

## Run it in a separate agent

The agent that wrote the tests is the worst judge of them, so another agent runs the audit.

Give it the three passes below, the scope, and the diff. It reads the tests and the source they
cover, runs the mutation checks, and returns the report. The test bodies stay out of the launching
session that way.

For `all`, launch one agent per test directory so no agent reads the whole suite.

In Claude Code that is the `general-purpose` agent, with the `model` and `effort` the user picked.

## Pick the model

Ask the user which model and reasoning effort the audit agent runs on before launching it. Skip the
question when the request already names them.

Offer only what the harness can launch now, read from its tool or config, not model names from
memory. Put the `model` from the record first as the recommended choice. With no record, recommend
the strongest model the harness offers at high effort. Finding gaps means working out which
behaviour changed and what would catch it, and a weak model misses them without saying so.

Ask with the harness's question tool, such as `AskUserQuestion` in Claude Code, or in plain text
where it has none.

## Pass 1: cuts

Flag a test that is any of these, and say which bug its deletion lets through:

- **A copy of the implementation.** It restates the source instead of fixing a result.
- **A mock checked against itself.** The assertion reads the mock, not the code under test.
- **A guarantee TypeScript or a dependency already gives.** `expectTypeOf` on a type the test file
  annotated itself proves nothing.
- **A duplicate.** Another test already fails on the same bug. Say which one.
- **Coupled to internals.** It breaks on a refactor that keeps the behaviour.
- **One case of many.** Cases that fail together buy one guarantee. Keep the boundary and one
  representative, cut the rest, or merge them into a table.

Propose a merge where two tests share setup and check related behaviour.

"Just in case" is not a reason to keep a test. Neither is a name that sounds important.

## Pass 2: gaps

For every behaviour the diff changes, say which test fails when the change is reverted. No such test
is a gap. Report it with the input and the expected result, not with a test name to add.

Check the error paths too: the throw, the `Err` branch, the lint diagnostic. They go untested more
often than the success path.

## Pass 3: liars

A test that passes whatever the source does. Break the source it covers, run it with the project's
test command, and confirm it goes red.

What to look for first:

- An assertion on a value the call under test produced, compared against itself.
- `toBeDefined`, `toBeTruthy`, or `toThrow()` with no matcher: any throw passes, including the wrong
  one.
- A promise not awaited, so the assertion runs after the test ends.
- `try`/`catch` that swallows the failure.
- `.skip`, `.only` or `.todo` still in the file.
- A snapshot committed without reading it.

## Report

One line per finding: `file:line`, what it is, and what deleting it would let through. Group by
pass, and cuts before gaps. End with the totals: tests read, cuts proposed, gaps, liars.
