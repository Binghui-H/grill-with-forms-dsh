---
name: grilling
description: Interview the user relentlessly about a plan, decision, or idea until every branch of the design tree is resolved. Use when the user wants their thinking stress-tested, or says grill, interrogate, or pressure-test.
---

# Grilling

Interview the user until you and they share one understanding of the design. Map the subject as a **design tree**: every decision branches into the decisions that hang off it.

## Work in rounds

The **frontier** is every decision whose prerequisites are already settled — the questions you can ask _now_ without guessing at answers you have not heard. Ask the whole frontier in one round, then wait. Each round of answers pushes the frontier outward and unblocks the next layer.

A question whose answer depends on a question still open in this round belongs to a **later** round, never this one.

How a round is physically asked is the calling skill's job:

- `grill-with-forms` batches the frontier into one `ask_user_question` call, with options and recommendations.
- `grill-me` asks the frontier as open prose questions, one round at a time.

## Every question carries a recommendation

Never ask the user to decide blind. State what you would do and why, in one sentence.

- With options: put the recommended option **first** and end its label with `(Recommended)`.
- Without options: say the recommendation in prose, right there in the round.

Word each question so that agreeing with your recommendation is the easy answer. "Yes" must never mean "no".

## Facts are yours, decisions are theirs

Finding facts is your job, never the user's. When a frontier question needs something from the environment, go and establish it: read the code, search the workspace, run the read-only command.

The decisions are the user's. Put each one to them and wait. Do not answer a decision question on their behalf, and do not quietly pick a default.

## Reading answers

A question answer is `{ id, selected, custom? }`:

- `custom` non-empty means the user wrote their own answer. For a single-select it **replaces** `selected`; treat it as the decision.
- `selected: []` with no `custom` means the question was **skipped**. It is not a "no" and not an answer.

## Stop condition

The session is done when the frontier is empty: every branch visited, nothing silently assumed. Summarise the settled decisions and the remaining assumptions, then stop. Do not act on the design until the user confirms you have reached a shared understanding.

Full rules, question-quality checks and anti-patterns: [references/grilling.md](references/grilling.md).
