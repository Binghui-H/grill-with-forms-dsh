# `grilling` — the shared primitive

The interview discipline everything else in this bundle loads. You rarely invoke it directly; `/grill-me`, `/grill-with-forms` and `/grill-with-docs` all load it first.

## What it does

Maps a plan as a **design tree**, then works it in rounds:

1. compute the **frontier** — every decision whose prerequisites are settled;
2. ask that whole layer, each question carrying a recommended answer;
3. wait for answers, recompute, ask the next layer;
4. stop when the frontier is empty.

Facts are the model's job to establish. Decisions are the user's to make. Nothing is acted on until the user confirms a shared understanding.

## Why it is a loadable skill, not a paragraph in each entry

Three entry skills need the same six rules. Inlining them three times means three places to fix when a rule changes, and three chances for the copies to drift.

Here it is a real skill because the `skill` tool enforces `isModelInvocable` before loading: a skill the model cannot load cannot be delegated to. See `.out-of-scope/implicit-invocation.md`.

## Why the elaboration lives in `references/`

`SKILL.md` carries the non-negotiable rules in about forty lines. `references/grilling.md` carries the reasoning, the question-quality checks and the anti-patterns, and is read only when a session needs it. Loading every rule up front would spend context on edge cases most sessions never hit.

## It's working if

- The questions arrive in layers, not as one wall.
- Each question says what the model would do, in one sentence.
- Questions the codebase can answer were answered by reading the codebase.
- The session ends with settled decisions and named assumptions, and nothing else.

## Common questions

**Do I invoke it directly?** Normally no. Invoke one of the three entries; they load this for you.

**Why does it ask me to confirm before acting?** Because an interview that starts producing code turns into a briefing — the user stops deciding and starts reviewing.

**What if I skip a question?** It stays open, and the closing summary lists it as open. Skipping is never read as "no".

## Where it fits

```text
grilling  ←  grill-me
          ←  grill-with-forms  ←  grill-with-docs
```

Full rules: [`assets/references/grilling.md`](../assets/references/grilling.md).
