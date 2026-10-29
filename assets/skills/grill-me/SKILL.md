---
name: grill-me
description: Grill a plan or design as open questions — no pre-baked options, one round at a time, so the user answers in their own words. Use when the design is still fuzzy and a multiple-choice card would flatten it.
disable-model-invocation: true
user-invocable: true
---

# Grill Me

Interview the user about a plan or design in **open questions**, so they answer in their own words instead of picking from a list you wrote too early.

Load and follow `grilling` for the interview itself. This skill decides only **how a round is asked**.

## Ask one round at a time

Ask the whole frontier in one round, as prose. Number the questions so answers can point at them:

> **Q1 — Where the export lands**
> One file per run, or one growing file? This sets whether a failed run is recoverable.
> *I would do one file per run*: a partial file is then obviously partial.
>
> **Q2 — Who can trigger it**
> Every user, or an admin flag? This decides whether we need a permission check at all.
> *I would start user-triggered*: the permission surface is not worth it for 0.1.

Then stop and wait. Do not pre-empt their answers, and do not ask the next layer in the same message.

## Keep the options out

Default to **no options at all**.

You may name alternatives only when they are genuinely enumerable and each one is a real, considered option — "one of: A / B / C", inline in the prose. Never a padded list invented to look thorough, and never as a substitute for the user's own phrasing.

If the user asks for clickable cards, or the frontier is a set of independent enumerable choices, tell them `/grill-with-forms` does exactly that and let them re-run — you cannot load that skill yourself, and pretending otherwise strands the round. Never change how you ask questions on your own.

## Same rules as any grilling

- Every question carries your recommendation and its reason, in prose.
- Facts are yours to look up; decisions are theirs to make.
- A skipped question stays open. Do not fill it in.
- The session ends when the frontier is empty, and nothing is acted on before the user confirms a shared understanding.

## Close

When the frontier is empty:

1. List the settled decisions one line each, and the remaining assumptions as assumptions.
2. **Offer the decision log, once.** Open questions soften even faster than cards do — an answer phrased in the user's own words is exactly what a later summary paraphrases away. Ask in a single prose line whether to write the answers to `.grill/<slug>-decisions.md`. Protocol, wording and format: [references/decision-log.md](references/decision-log.md). Write only on a yes.
3. **Never write a glossary or an ADR.** Those need judgement about the project and belong to `/grill-with-docs`.

Full rules: [references/grilling.md](references/grilling.md).
