---
name: grill-with-docs
description: Grill a design through question cards and leave the paper trail that needs judgement — glossary terms written as they resolve, ADRs only when a decision clears three gates. Use when the outcome has to survive the session.
disable-model-invocation: true
user-invocable: true
---

# Grill With Docs

The card interview, plus the two artifacts that require judgement. Every other grilling skill leaves the outcome in the conversation; this one writes down what a later reader will need.

Load and follow `grilling` for the interview, and apply the card rules in [references/form-batching.md](references/form-batching.md) for how each round is asked. This skill never changes how questions are asked — only what gets written down afterwards.

## Two artifacts, both earned

| What resolved | Where it lands | When |
|---|---|---|
| A **term** — the project's own word for a thing | `GLOSSARY.md` at the repo root | the moment it resolves, term by term. Never batched at the end |
| A **decision** that is hard to reverse, surprising without context, and a real trade-off | `docs/adr/NNNN-<slug>.md` | only when all three gates pass |

Most sessions sharpen the glossary and produce **zero** ADRs. That is working as designed, not a failure.

Both rows need judgement — which words are the project's own, and which decisions clear the gates — which is exactly why they live here instead of happening automatically.

The verbatim decision log is **not** this skill's job, but this skill still offers it. `grill-with-forms` is not loaded here — only its card rules are, from the reference file — so the offer has to come from this session too. Protocol, wording and format: [references/decision-log.md](references/decision-log.md).

## Rules

- **Write only from confirmed answers.** A skipped question, a cancelled card, or an unconfirmed batch produces no file. If nothing was confirmed, write nothing.
- **`GLOSSARY.md` is vocabulary and nothing else.** No implementation detail, no spec prose, no scratch notes. Format: [references/glossary-format.md](references/glossary-format.md).
- **ADR gates are all three or nothing.** Hard to reverse, surprising without context, a real trade-off. Format and the qualifying-decision list: [references/adr-format.md](references/adr-format.md).
- **Create files lazily.** No glossary until the first term settles; no `docs/adr/` until the first ADR is earned. Never scaffold empty directories up front.
- **Challenge the user's wording** against the existing glossary rather than quietly redefining a term that is already defined.

## Close

The interview ends as it does in `grilling`: settled decisions, remaining assumptions, open questions. Then:

1. Write the glossary and ADR artifacts for what was **confirmed**, and report the exact paths written. If nothing was confirmed, write nothing.
2. **Offer the decision log, once**, exactly as [references/decision-log.md](references/decision-log.md) describes. Write it only on a yes.

Domain-language discipline in full: [references/domain-modeling.md](references/domain-modeling.md).
