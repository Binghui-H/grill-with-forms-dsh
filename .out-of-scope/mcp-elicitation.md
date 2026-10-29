# Out of scope: MCP server and elicitation

The Codex version of `grill-with-forms` was an MCP server exposing `collect_form_answers`, which called MCP `elicitation/create` to get a native form. That server is **not** ported here.

## Why

`@deepseek-ai/dsh-mcp-client` does not implement MCP elicitation. Searching the package for `elicit` returns no matches: there is no `elicitation/create` handler, no form-mode request, no provider seam for it. An MCP server that calls `elicitInput` against DSH would wait out its own timeout and return an error, on every call.

The DSH equivalent is not a lower-level seam to fill in — it is a higher-level capability that already exists:

| Codex version needed | DSH has |
|---|---|
| MCP server process | nothing to run |
| `collect_form_answers` tool | `ask_user_question` |
| hand-written JSON Schema for the form | tool schema plus `options` / `multi_select` |
| own "other" free-text field | `custom` in every answer |
| own recommendation field | `(Recommended)` label suffix drives the badge |
| own timeout and approval handling | the tool waits on the human; cancellation rides the turn's signal |

Keeping the server would mean forking `dsh-mcp-client` to add a second, competing question surface next to `ctx.userQuestions`. Two ways to ask a question in one harness is worse than one.

## What was kept

The parts of the Codex version that were never about transport:

- the batching rules (3–6 per round, 8 ceiling, independent decisions only) — `references/form-batching.md`
- the "investigate facts first, ask only decisions" rule — inherited from `grilling`
- the three-state handling of a submission (accepted / declined / cancelled), which maps to `selected` / skip / tool error here
- the refusal to describe Markdown bullets as a card the user clicked

The code was not kept: no `collect_form_answers`, no zod request validation, no `.mcp.json`.

## Related

- [html-questionnaire.md](html-questionnaire.md) — why not an HTML page with a callback either
- [question-limits.md](question-limits.md) — the caps that survived the port
