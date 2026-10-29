# dsh-grill-with-forms

Clarify a design through native DSH question cards: one round asks every independent decision at once, each with a recommended answer and a free-text escape.

A DSH plugin bundle: four skills, roughly 120 lines of code, no resident service.

## What it does

```text
User goal
  → /grill-with-forms  (or /grill-me, /grill-with-docs)
  → investigate facts yourself; put only decisions to the user
  → compute the frontier — what can be asked now
  → one ask_user_question call asks that whole layer
  → native card: single/multi select, recommendation badge, free text
  → answers arrive, recompute the frontier, ask the next layer
  → empty frontier → settled decisions + remaining assumptions
```

## Three entry points

Type `/` in the input box. Skills with `disable-model-invocation: true` are reachable only there, and the menu marks them user-only.

| Entry | How it asks | When |
|---|---|---|
| `/grill-me` | **No options.** Open prose questions, one round at a time; offers the decision log at close | The design is still fuzzy; multiple choice would flatten it |
| `/grill-with-forms` | 3–6 questions per batch, options plus a recommendation badge | Decisions are enumerable and you want them settled fast |
| `/grill-with-docs` | As above, plus a glossary and ADRs written to disk | The outcome has to outlive the session |
| `grilling` | Shared primitive, model-invocable | Loaded by the three above, or by you |

`grilling` is a library skill and must stay model-invocable — the `skill` tool refuses to load it otherwise.

## Install

```powershell
dsh plugin --profile desktop add D:\git\grill-with-forms-dsh
```

Or from a tarball or git:

```powershell
dsh plugin --profile desktop add ./dsh-grill-with-forms-0.1.0.tgz
dsh plugin --profile desktop add github:Binghui-H/grill-with-forms-dsh
```

No restart is needed: the skill catalog refreshes and the three entries appear under `/`. Remove with:

```powershell
dsh plugin --profile desktop remove dsh-grill-with-forms
```

Plain-file install is also possible — copy `assets/skills/*` plus `assets/references/*` into each `~/.dsh/skills/<name>/references/`. See the Chinese README for the exact command.

## Answer shape

`{ id, selected, custom? }`:

| Returned | Meaning |
|---|---|
| `selected: ["Desktop only (Recommended)"]` | The user clicked the recommendation |
| `selected: []` + `custom: "..."` | The user typed their own answer. On a single-select `selected` is cleared by design |
| `selected: []`, no `custom` | Skipped. The decision stays **open** — never read it as "no" |
| Tool error | No question provider; degrade to prose |

The typed-answer case is not an edge case: with a text box in front of them, users type instead of clicking. So `custom` is treated as a first-class answer.

## Artifacts

Every session closes the same way: a summary of what settled, **one question** asking whether to write the decision log, and nothing else.

| Artifact | Written by | Trigger |
|---|---|---|
| `.grill/<slug>-decisions.md` | **Each entry point asks once** | Offered once at close; written only if the user says yes |
| `GLOSSARY.md` | `grill-with-docs` | The moment a term resolves, term by term |
| `docs/adr/NNNN-*.md` | `grill-with-docs` | Hard to reverse + surprising without context + a real trade-off |

The log is transcription, not judgement, so it rides on the lightest entry point. It used to belong to `grill-with-docs` alone, which meant a quick design chat left no precise record — and once the context compacts, "retries capped at 3, the fourth is terminal" quietly becomes "retries are bounded".

Glossary entries and ADRs need judgement — which words are the project's own, which decisions clear the gates — so they stay behind `/grill-with-docs`.

Most sessions produce a sharper glossary and zero ADRs. That is working as designed.

## Why not port the Codex plugin

The original was an MCP server using `elicitation/create`. None of that survives here: `dsh-mcp-client` does not implement elicitation, `ask_user_question` already batches questions with options and free text, and `resourceBase` already lets skills share reference files. So this repository has no server, no schema validation dependency and no MCP config — only the interview discipline.

## Limitations

- No question-level `detail` field: put "why this matters" in the question text or an option description.
- The recommendation badge derives from a `(Recommended)` label suffix.
- The question tool is mounted per agent preset; without it the skills ask in prose rather than pretending a card was shown.
- A subagent owned by another live agent cannot ask the user (`DELEGATED_CALLER`).
- The 8-question and 8-option ceilings are deliberate UX limits: past them, split the batch or ask open.

## Attribution

The interview discipline and the glossary/ADR formats are adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © 2026 Matt Pocock). See [ATTRIBUTION.md](./ATTRIBUTION.md).

## 中文

[README.md](./README.md)
