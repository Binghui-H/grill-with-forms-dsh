---
name: grill-with-forms
description: Grill a plan or design through native DSH question cards — batched independent decisions, each with options, a recommended answer and the user's own free-text answer. Use when the user wants fast, clickable design clarification.
disable-model-invocation: true
user-invocable: true
---

# Grill With Forms

Interview the user about a plan or design using `ask_user_question`, so one round of independent decisions arrives as a single card the user can click through.

Load and follow `grilling` for the interview itself. This skill decides only **how a round is asked**. Limits, schema and failure modes: [references/form-batching.md](references/form-batching.md).

## Run one round

1. **Investigate first.** Read the code and files involved. Ask only what the user must decide.
2. **Build the decision graph.** Every question gets a stable ASCII `id`, the decision it resolves, its recommended option, and what it depends on.
3. **Take the ready set** — questions whose dependencies are already answered and that do not change each other's meaning. Ask that whole set in **one** `ask_user_question` call.
4. **Wait.** Then record the answers, recompute, and ask again only if the next set is non-empty.

## Shape the round

- **3 to 6 questions** is the comfortable batch. **8 is the ceiling.** Past it, split along dependency order — never by generation order.
- A ready set of **one or two** questions is asked **as-is**. Never pad it to three with a question whose dependencies are still open.
- **2 to 8 options** per question. A decision needing more is not a pick-list question: split it, or ask it as free text.
- Put the recommended option **first** and end its label with `(Recommended)`.
- Use `multi_select` only for choices that are genuinely independent. Never merge two separate decisions into one multi-select.
- One idea per question. No compound questions joined by "and".
- The "why this matters" belongs in the question text or in an option `description`. Do not invent fields the tool does not accept.

## Read the answers

- **`custom` with a value is the decision.** For a single-select, `selected` is empty when the user typed instead of picking — that is the documented shape, not a missing answer.
- **`selected: []` with no `custom` is a skip.** Leave that decision open and say which one is open.
- **A tool error means the form surface is unavailable.** Say so plainly and continue the same round as prose questions. Never describe Markdown bullets as a card the user clicked.

## Never

- Never treat an unconfirmed batch as decided. No summary, no file, no code change until the answers came back.
- Never chain a second card in the same round. One round is exactly one call; questions the first card could have carried do not get a second one.
- Never claim a round was submitted when the call did not return.
- Never ask for a fact you could have read yourself.
- Never offer a recommended option for a decision you have no basis to recommend.

## Close

When the frontier is empty:

1. List the settled decisions one line each, and the remaining assumptions as assumptions.
2. **Offer the decision log, once.** Ask in a single prose line whether to write the answers to `.grill/<slug>-decisions.md`. The file format and the exact ask are in [references/decision-log.md](references/decision-log.md). Write only on a yes. Do not render this as a card: it is housekeeping that arrives after the interview, not a design decision inside it.
3. **Never write a glossary or an ADR.** Those need judgement about the project and belong to `/grill-with-docs`.
