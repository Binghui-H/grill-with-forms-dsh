# `/grill-with-docs` — cards plus the paper trail

The card interview, plus the two files that need judgement. This is the stateful one.

Every other grilling skill leaves the outcome in the conversation. This one writes down what a later session, a colleague, or a compacted context will need.

## What it produces

| What settled | Where it lands | When |
|---|---|---|
| A **term** — your project's word for a thing | `GLOSSARY.md` at the repo root | the moment it resolves, term by term |
| A **decision** clearing three gates | `docs/adr/NNNN-<slug>.md` | hard to reverse + surprising without context + a real trade-off |

Files are created lazily: no glossary until the first term settles, no `docs/adr/` until the first ADR is earned. Nothing is scaffolded up front.

Both entries need judgement — which words are the project's own, and which decisions clear the gates — which is exactly why they are opt-in instead of automatic.

## The decision log moved

The verbatim decision log (`.grill/<slug>-decisions.md`) is **offered by every card session**, in one prose line at close — including this one. The reasoning: the log needs no judgement — it is mechanical transcription — but it is the only defense against a prose summary softening "retries capped at 3, the fourth failure is terminal" into "retries are bounded". That protection should not depend on you picking the heavy entry point, and it should not depend on which entry you happened to pick either.

The offer protocol lives in one file, read by both skills, because they never load each other. If you said no, nothing is written and it is not re-asked.

## It's working if

- `GLOSSARY.md` changes **during** the session, term by term, rather than appearing in one lump at the end.
- The glossary reads as pure vocabulary, with no implementation detail or spec prose.
- You get few or no ADRs, and the ones you get are decisions you would hate to argue again.
- It challenges a word you used because the existing glossary defines it differently.
- You were asked **once**, at close, whether to write the decision log.

## Common questions

**It ran, but no `GLOSSARY.md` appeared.** Two causes. Nothing qualified — a session with no new vocabulary writes nothing, and that is correct. Or every batch was skipped / cancelled, in which case nothing is written by design.

**Why so few ADRs?** All three gates must hold at once. Most sessions produce zero, and a sharper glossary instead. Upstream reports this as the most common surprise; it is intentional here too.

**Where did the rest of my decisions go?** Into the decision log, if you said yes to the offer at close. `grill-with-forms` asks once; if you declined, nothing was written.

**Does it write without asking?** No. `GLOSSARY.md` is written from **confirmed** terms as they resolve, and ADRs only when you earned one. The paths written are reported back.

## Where it fits

```text
grilling → grill-with-forms → grill-with-docs → (your spec / tickets, elsewhere)
```

Formats: [`glossary-format.md`](../assets/references/glossary-format.md), [`adr-format.md`](../assets/references/adr-format.md). The log you may have written: [`decision-log.md`](../assets/references/decision-log.md). Discipline: [`domain-modeling.md`](../assets/references/domain-modeling.md).
