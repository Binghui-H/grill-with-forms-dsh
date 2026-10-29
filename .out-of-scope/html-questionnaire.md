# Out of scope: HTML questionnaire with a URL callback

An HTML page the user fills in the browser, whose submission resumes the conversation, is out of scope.

## Why

The appeal is obvious: HTML can render anything — conditional fields, long-form text, file attachments, a progress bar across forty questions. The card cannot.

The blocker is not rendering, it is **resumption**. A resumed conversation needs a real callback into the waiting turn:

- a URL elicitation transport (DSH has none),
- a session token that identifies which turn is waiting,
- idempotency on the callback, so a double submit does not answer twice,
- cleanup when the turn is cancelled or times out,
- and a local HTTP surface the client trusts.

That is a service, a token store and a lifecycle — for a feature whose entire value is asking better questions. Meanwhile the generated HTML file can only display content: it cannot wake the session, so the user's answers come back as a copy-pasted blob, which is strictly worse than the card.

## What would change this

If DSH ships a URL elicitation transport with a resumption contract, this decision should be revisited. Until then, "richer form" is not blocked by the card's rendering — it is blocked by the callback.

## Related

- [mcp-elicitation.md](mcp-elicitation.md) — the transport that does exist
- [question-limits.md](question-limits.md) — the caps that keep a card readable
