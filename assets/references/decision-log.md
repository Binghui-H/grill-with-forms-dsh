# Decision log format

The `.grill/<slug>-decisions.md` file holds every confirmed answer, verbatim, so the precise part of a decision survives the conversation.

## Why it exists

A design conversation produces decisions that later prose softens. "Retries are capped at 3, and the fourth failure is terminal" becomes "retries are bounded" — which reads fine and no longer tells anyone what to build. The glossary cannot hold this (it is vocabulary only), and an ADR should not (most decisions do not clear the three gates).

So the answers go into their own file, unchanged, as a table.

## Template

```md
# <Topic> — decision log

Grilled on <date>. <One line: what this session was deciding.>

| # | Question | Answer | Source |
|---|---|---|---|
| 1 | Do we ship desktop only for 0.1? | Desktop only | selected |
| 2 | Where does the export land? | One file per run, under `%LOCALAPPDATA%` | custom |
| 3 | Do we keep the legacy reader? | — | skipped |

## Assumptions that remain

- The partner API keeps returning ISO-8601 timestamps. Nothing in the session confirmed it.

## Questions still open

- Nothing. The frontier was empty at close.
```

## Rules

- **`Source` is `selected` or `custom`, matching how the answer arrived.** It tells a later reader how much weight to give the phrasing: a clicked label is your wording, a typed answer is theirs.
- **Never paraphrase into the `Answer` column.** If the user wrote "只有桌面端", the row says `只有桌面端`, not "desktop only". The log's whole value is fidelity.
- **A skipped question gets a row with `—` and `Source: skipped`.** It records that the question was asked and not answered, which is different from never having asked.
- **Keep the question text short but unambiguous.** It is the only context the answer has later.
- **Assumptions get their own section**, labelled as assumptions. A decision and an assumption must never look alike.
- **One file per grilled topic**, `<slug>` from the topic. Appending to an existing log for the same topic is correct; starting a second file for the same topic is not.

## Offering it

Writing this file is a side effect, so it is offered rather than assumed. **Every entry point asks once per session** — `grill-me`, `grill-with-forms` and `grill-with-docs` alike. The offer lives in this file precisely because the skills do not load each other; each one reads the same protocol from here.

The ask is **one prose line**, after the closing summary, with the real path in it:

> 这次谈定的东西要不要记到 `.grill/<slug>-decisions.md`？逐字保留答案，不加工。

Rules for the offer:

- **Once per session.** If the user says no, the answer is no — do not re-ask at the next round or reword it later.
- **Prose, not a card.** It is housekeeping after the interview, not a design decision inside it. A card here spends the user's attention at the exact moment the session is over.
- **Only after the frontier is empty.** Offering mid-session interrupts the interview and invites the user to leave the design half-decided.
- **Silence is not consent.** No answer means no file. Never write it anyway and mention it afterwards.
- **If nothing was confirmed, do not offer.** A session where every question was skipped has nothing to record.

When the user says yes: write the file, then report the path in one line. When they say no: say nothing further about it.

## What does not belong here

- Implementation notes, code snippets, task lists. The log records decisions, not plans.
- Terms. Those go in `GLOSSARY.md` (see [glossary-format.md](glossary-format.md)).
- Anything not confirmed. An unconfirmed batch contributes nothing.
