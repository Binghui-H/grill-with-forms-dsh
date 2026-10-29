# ADR format

Decisions live in `docs/adr/` with sequential numbering: `0001-slug.md`, `0002-slug.md`, and so on. Create the directory lazily, when the first ADR is earned.

## Template

```md
# {Short title of the decision}

{1–3 sentences: the context, what was decided, and why.}
```

That is the whole template. An ADR can be one paragraph. The value is in recording **that** a decision was made and **why** — not in filling in sections.

## Optional sections

Include these only when they add real value. Most ADRs will not need any of them.

- **Status** — `proposed | accepted | deprecated | superseded by ADR-NNNN`. Useful when decisions get revisited.
- **Considered options** — only when the rejected alternatives are worth remembering.
- **Consequences** — only when non-obvious downstream effects need calling out.

## Numbering

Scan `docs/adr/` for the highest existing number and add one. Never renumber an existing ADR.

## The three gates

All three must hold, or skip the ADR:

1. **Hard to reverse** — changing your mind later costs something real.
2. **Surprising without context** — a future reader will look at the code and wonder why.
3. **A real trade-off** — genuine alternatives existed and one was chosen for specific reasons.

Easy to reverse? You will just reverse it. Not surprising? Nobody will wonder. No alternative? There is nothing to record beyond "we did the obvious thing".

## What qualifies

- **Architectural shape.** "The write model is event-sourced; the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing communicate through domain events, not synchronous HTTP."
- **Technology choices that carry lock-in.** Database, message bus, auth provider, deployment target. Not every library — only the ones that would take a quarter to swap.
- **Boundary and scope decisions.** "Customer data is owned by the Customer context; others reference it by ID only." The explicit no-s are as valuable as the yes-s.
- **Deliberate deviations from the obvious path.** "Manual SQL instead of an ORM, because X." This is what stops the next engineer from "fixing" something deliberate.
- **Constraints invisible in the code.** "No AWS, for compliance reasons." "Under 200 ms, per the partner API contract."
- **Non-obvious rejected alternatives.** If GraphQL was considered and REST won for subtle reasons, record it, or someone will suggest GraphQL again in six months.

## Attribution

Adapted from `ADR-FORMAT.md` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © 2026 Matt Pocock). See `ATTRIBUTION.md`.
