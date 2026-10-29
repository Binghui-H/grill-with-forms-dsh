# GLOSSARY.md format

## Structure

```md
# {Context Name}

{One or two sentences: what this context is and why it exists.}

## Language

**Order**:
An intent to buy, placed by a Customer.
_Avoid_: Purchase, transaction

**Shipment**:
The physical dispatch of one or more Orders.
_Avoid_: Delivery, fulfilment
```

## Rules

- **Be opinionated.** When several words exist for one concept, pick the best one and list the rest under `_Avoid_`. The `_Avoid_` line is the part that stops the codebase drifting back.
- **Keep definitions tight.** One or two sentences. Define what the thing **is**, not what it does.
- **Only project-specific terms.** General programming concepts — timeouts, error types, utility patterns — do not belong, even when the project uses them heavily. Before adding a term ask: is this unique to this context, or a general programming concept? Only the first one goes in.
- **Group under subheadings** when natural clusters appear. A single cohesive area can stay a flat list.
- **Vocabulary only.** No implementation detail, no spec prose, no backlog notes, no links to code.

## Single versus multi-context repos

**Single context (most repos):** one `GLOSSARY.md` at the root.

**Multiple contexts:** a `GLOSSARY-MAP.md` at the root lists the contexts, where each lives, and how they relate:

```md
# Glossary Map

## Contexts

- [Ordering](./src/ordering/GLOSSARY.md): receives and tracks customer orders
- [Billing](./src/billing/GLOSSARY.md): generates invoices and processes payments

## Relationships

- **Ordering → Billing**: Ordering emits `OrderPlaced` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: shared types for `CustomerId` and `Money`
```

How to infer the structure:

- `GLOSSARY-MAP.md` exists → read it to find the contexts.
- Only a root `GLOSSARY.md` exists → single context.
- Neither exists → create a root `GLOSSARY.md` lazily, when the first term resolves.

With multiple contexts, infer which one the current topic belongs to. If it is genuinely unclear, ask — that is a decision question, not a fact question.

## Attribution

Adapted from `GLOSSARY-FORMAT.md` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT, © 2026 Matt Pocock). See `ATTRIBUTION.md`.
