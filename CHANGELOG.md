# Changelog

## 0.1.0

First release, built for DeepSeek Harness.

- Four skills: `grilling` (shared primitive), `grill-me` (open questions, no options), `grill-with-forms` (batched question cards), `grill-with-docs` (cards plus a glossary and ADRs on disk).
- One bundled skill provider (`lib/skills.js`) serving all four from `assets/skills/`, with `resourceBase` pointing at `assets/` so every skill resolves the shared `references/*.md` by absolute path.
- Invocation policy mirrors the filesystem provider: `disable-model-invocation` and `user-invocable` in frontmatter resolve to the registry's `{ modelInvocable, userInvocable }`, so a plain-file install behaves like the bundle.
- `ask_user_question` is the only transport. No MCP server, no elicitation, no schema dependency: `dsh-mcp-client` does not implement elicitation, and DSH's question card already carries options, a recommendation badge and a free-text answer.
- Decision log (`.grill/<slug>-decisions.md`) records every confirmed answer verbatim, with `selected` / `custom` / `skipped` provenance. Offered once at the end of every session by all three entry points, written only on a yes — it needs transcription, not judgement, so it does not sit behind the heavy entry point.
- Entry skills share the card rules and the log protocol through reference files, never by loading a sibling skill — DSH refuses to load a user-invocable-only skill, and a contract test now enforces that.
- Contract tests (`test/skills.spec.mjs`) cover the skill tree, frontmatter format, catalog budget, reference resolution, stale-name rejection, invocation policy and sibling-loading.
