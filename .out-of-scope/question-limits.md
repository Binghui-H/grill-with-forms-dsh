# Out of scope: unlimited questions per round

The card caps a round at 8 questions and a question at 8 options. Upstream `grilling` deliberately sets no cap at all.

## Why the caps are here

A card is a bounded surface. DSH renders it as a fixed-height dialog: header, navigation and submit stay put, the question detail and the options share an internal scroll area. Past roughly eight questions the user is navigating rather than deciding, and the batch stops being a round.

The options ceiling has a different cause. Eight options is already more than a person reads carefully; a nine-option question usually means the decision was never enumerated properly — it should be split into two decisions, or asked as free text.

## Why upstream rejects caps

`question-limits.md` upstream argues limits distort the interview: a real frontier might legitimately hold twelve questions, and forcing a split invents an ordering that the design tree does not have.

That argument holds for text. In prose, twelve questions in one message is a wall the user scrolls; nothing breaks. In a card, the ceiling is where the widget stops being usable.

## How this is reconciled

The cap applies to **the batch, not the round**:

- split along dependency order, so the split is the decision tree's, not an arbitrary twelve-versus-eight cut;
- if two questions are independent, splitting them across two cards costs one extra submit and changes nothing about the interview;
- if a decision needs more than eight options, it is not a pick-list question — `references/form-batching.md` requires dropping `options` and asking it open.

So the interview keeps upstream's semantics (the whole ready set gets asked) while the card stays readable.

## Related

- [mcp-elicitation.md](mcp-elicitation.md)
- `assets/references/form-batching.md` — the limits as the skill states them
