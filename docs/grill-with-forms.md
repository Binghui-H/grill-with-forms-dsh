# `/grill-with-forms` — batched question cards

Grills a design through native DSH question cards: one round of independent decisions arrives as a single card you can click through.

## What it does

```text
investigate facts
  → build the decision graph
  → take the ready set (dependencies answered, mutually independent)
  → one ask_user_question call for that whole set
  → answers arrive → recompute → next set
  → frontier empty → settle, summarise, stop
```

The interview itself is `grilling`. This skill only decides **how a round is asked**.

## When to reach for it

Type `/grill-with-forms`. The model cannot start it on its own — an interview is your decision to make.

| You have | Reach for |
|---|---|
| A design whose decisions you can name | `/grill-with-forms` |
| A design still too fuzzy to enumerate | `/grill-me` |
| A design whose outcome must outlive the session | `/grill-with-docs` |
| A decision blocked on someone else's knowledge | not this bundle — write a questionnaire (see upstream `to-questionnaire`) |

## What a round looks like

- 3–6 questions is the comfortable batch; 8 is the ceiling.
- 2–8 options each; more than that means the decision needs splitting or an open question.
- The recommended option goes **first** and ends with `(Recommended)` — that suffix is what the card renders as a recommendation badge.
- Every question keeps a free-text answer. Users use it constantly.

## Answer shapes you will see

| Returned | Meaning |
|---|---|
| `selected: ["…(Recommended)"]` | You clicked the recommendation |
| `selected: []` + `custom: "…"` | You typed your own answer; `selected` is cleared by design |
| `selected: []`, no `custom` | You skipped. The decision is still **open** |
| Tool error | No question provider in this preset; the skill asks in prose instead |

## It's working if

- The card holds a handful of questions that could all be answered without waiting for each other.
- Each question is one decision, not two joined by "and".
- You can answer every question by clicking, and can still type whenever your answer is not on the list.
- Nothing is summarised as "decided" that you skipped.

## How it ends

Three steps, in order:

1. A one-line-each summary of what got settled, and what is still an assumption.
2. **One question**: whether to write the answers to `.grill/<slug>-decisions.md`. Prose, not a card — it arrives after the interview, so a card would be asking you to click at the exact moment you thought you were done. Say no and nothing is written.
3. Nothing else. It never touches `GLOSSARY.md` or `docs/adr/`; those need judgement and belong to `/grill-with-docs`.

The log exists because a prose summary softens precise answers — "retries capped at 3, the fourth failure is terminal" quietly becomes "retries are bounded". The log keeps them verbatim and records whether each answer was clicked (`selected`) or typed (`custom`).

## Common questions

**Why not put every question in one card?** Because later questions depend on earlier answers. Asking them together means the model guessed your answer to build the options.

**Why is there a limit of 8?** A card is a fixed-height dialog; past eight questions you are navigating, not deciding. Split along dependency order, not by count.

**The model asked me something it could have looked up.** That is a bug in the round — `references/grilling.md` names it as the most common way to waste your patience. Close the card and say so.

**Can I use this without the plugin?** Yes — copy `assets/skills/*` plus `assets/references/*` into `~/.dsh/skills/`. The README has the exact command.

## Where it fits

```text
grilling → grill-with-forms → grill-with-docs
```

Limits and failure modes: [`assets/references/form-batching.md`](../assets/references/form-batching.md).
