# Domain modeling

The active discipline behind `grill-with-docs`: build and sharpen the project's domain language as you design, and write it down the moment it crystallises.

Merely *reading* `GLOSSARY.md` for vocabulary is not this. This is for when you are **changing** the model, not consuming it.

## File layout

A single-context repo (most repos):

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

A multi-context repo has a `GLOSSARY-MAP.md` at the root pointing at each context's own `GLOSSARY.md` and `docs/adr/`.

Create files lazily: `GLOSSARY.md` when the first term resolves, `docs/adr/` when the first ADR is earned.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language, say so immediately.

> "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

Not challenging is how a codebase ends up with two meanings for one word and a third in the tests.

### Sharpen fuzzy language

When a term is vague or overloaded, propose a precise canonical term.

> "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Stress-test with concrete scenarios

When relationships are being discussed, invent scenarios that probe the boundaries between concepts — the empty case, the concurrent case, the renamed case. Precision about boundaries is what a domain model is for.

### Cross-reference with the code

When the user states how something works, check whether the code agrees.

> "Your code cancels entire orders, but you just said partial cancellation is possible. Which is right?"

A contradiction between the stated model and the code is a decision the user has to make, not something to paper over.

### Update the glossary inline

When a term resolves, write it into `GLOSSARY.md` right there. Do not batch these to the end of the session: batching loses the terms nobody repeated. Format: [glossary-format.md](glossary-format.md).

The glossary stays totally devoid of implementation detail. It is a glossary and nothing else.

### Offer ADRs sparingly

Only when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful.
2. **Surprising without context** — a future reader will wonder "why did they do it this way?".
3. **A real trade-off** — there were genuine alternatives and one was picked for specific reasons.

If any is missing, skip it. Format and qualifying examples: [adr-format.md](adr-format.md).

## Attribution

Adapted from the `domain-modeling`, `GLOSSARY-FORMAT` and `ADR-FORMAT` skills in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © 2026 Matt Pocock). See `ATTRIBUTION.md`.
