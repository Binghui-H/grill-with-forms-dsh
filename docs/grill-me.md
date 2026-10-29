# `/grill-me` — open questions, no options

The same interview as `grilling`, asked in prose with **no pre-baked options**, so the answer stays in your words.

## What it does

Asks the whole frontier in one round, as numbered prose questions. Each carries a recommendation and its reason. Then it stops and waits.

> **Q1 — Where the export lands**
> One file per run, or one growing file? This sets whether a failed run is recoverable.
> *I would do one file per run*: a partial file is then obviously partial.

## When to reach for it

Type `/grill-me`. The model cannot start it on its own.

Reach for it when the design is still fuzzy. A multiple-choice card forces you to pick from options the model already imagined; at the fuzzy stage that is a narrowing, not a clarification.

## Why a separate skill from `/grill-with-forms`

Both load `grilling`; they differ in one policy — whether a question may carry options.

That difference is worth a separate entry because it is the whole disagreement about structured question UIs. Upstream Matt Pocock's skills reject native question tools outright, arguing that structured pickers push the model towards multiple choice with pre-baked answers. `/grill-me` is that position, kept intact and available.

## It's working if

- Questions have no option list attached.
- Alternatives, when mentioned, are named inline and are real ("one of: A / B / C").
- The round stops after one layer instead of stacking the next.
- You find yourself writing an answer the model did not anticipate — that is the point.

## Common questions

**When should it offer options?** Only when the alternatives are genuinely enumerable and each is a real, considered option. Never a padded list invented to look thorough.

**Can it switch to cards mid-session?** It can suggest `/grill-with-forms` if the frontier becomes a set of independent enumerable choices. It must not switch silently.

**Does it write files?** No. That is `/grill-with-docs`.

## How it ends

Same three steps as any grilling session: a summary of what settled, **one question** about writing `.grill/<slug>-decisions.md`, nothing else.

That offer matters more here, not less. Cards at least pin an answer to a label you can quote back; an open answer lives only in the user's phrasing — "重试上限 3 次，第 4 次终止" in a paragraph becomes "重试有上限" the moment anything summarises it.

## Where it fits

```text
grilling ─┬─→ grill-me            (open questions)
          └─→ grill-with-forms → grill-with-docs   (cards)
```

Full rules: [`assets/references/grilling.md`](../assets/references/grilling.md).
