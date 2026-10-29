# Grilling — full rules

The interview discipline shared by `grilling`, `grill-me`, `grill-with-forms` and `grill-with-docs`. The `SKILL.md` files carry the non-negotiable part; this file carries the reasoning and the edge cases.

## 1. The design tree

Any plan is a tree of decisions. The root is the goal. Each branch is a decision, and each decision opens the decisions that only make sense once it is settled.

```
"Ship a CSV export"
├── Where does the file go?        → opens: overwrite or version?
├── Who can trigger it?            → opens: rate limit?
└── Which rows are included?       → opens: redaction rules?
```

Write the tree down before asking anything — in your reasoning, or as a short list in the conversation when it helps the user follow. The tree is what keeps a long interview from becoming a random walk, and it is what tells you the interview is finished.

## 2. The frontier

A decision is on the **frontier** when every decision it depends on is already settled. The frontier is exactly the set you can ask now without guessing at an answer you have not heard.

- Ask the **entire** frontier in one round. Asking only part of it wastes a round the user has to sit through.
- Never ask **beyond** it. A question whose premise is still open forces you to assume the answer, and then you are interviewing yourself.

After each round, recompute. Settled decisions push the frontier outward; blocked questions become askable. Repeat until the frontier is empty.

## 3. Question quality

| Check | Fails when |
|---|---|
| One idea | "Should we cache, and where?" is two decisions in one sentence |
| Answerable now | The user cannot answer without a fact nobody has established |
| Not a survey | You are asking for something you could read, measure or derive |
| Consequential | Both answers lead to the same code — the question is noise |
| Recommended | There is no "what I would do", so the thinking lands back on the user |

## 4. Facts versus decisions

**Facts** — which file holds the config, whether a test covers the path, what the device's sampling rate is, whether the API supports paging. Yours. Read, search, run read-only commands. Asking for a fact you could have looked up is the most common way to waste the user's patience.

**Decisions** — which trade-off the project accepts, what "done" means, which risk is worth taking, what to cut from the first release. Theirs. Put each one to them and wait.

Never infer a decision from silence, from a skipped question, or from your own preference. A skipped question stays open and is reported as open.

If fact-finding is slow, do not block the whole round on it. Only the questions **downstream** of that fact wait; the rest of the frontier can go now.

## 5. Wording

Word each question so the easy answer is your recommendation.

- Prefer: "Do we ship desktop only for 0.1?" — agreeing is "yes".
- Avoid: "Should we ship desktop only or also web?" — agreeing with you is now the harder path.

Keep negations straight. Prefer "Do we keep the old format read-only?" over "Do we not drop support for the old format?".

Name the decision, not the implementation: "Where does the export go?" beats "Should we call `writeFileSync` in the controller?".

## 6. Rounds and pacing

One round, then wait. Do not stack the next round into the same message: its questions depend on answers you have not read, so they would be guesses dressed as questions.

If the user answers partially, take what you got, mark the rest open, and say which ones are still open. Do not re-ask the whole round to fill two gaps.

If the user pushes back on the shape ("too many questions", "just decide"), compress to the highest-consequence branch rather than dropping the interview.

## 7. Closing

The frontier is empty when every branch is visited and nothing is silently assumed. Close with exactly three things:

1. the settled decisions, one line each;
2. the assumptions that remain, explicitly labelled as assumptions;
3. the open questions, if any survived.

Nothing else. No plan document, no code, no file — until the user confirms the shared understanding.

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| Dumping every question at once, ignoring dependencies | Later answers invalidate earlier ones; the user answers questions that no longer exist |
| Options with no recommendation | Shifts the thinking back onto the user — the exact thing they asked you to do |
| A pre-baked option list for an open design question | Flattens the decision to what you already imagined, and hides the option you did not think of |
| Treating a skipped question as "no" | Decides for the user, silently |
| Acting before confirmation | The interview degrades into a briefing, and the user finds out afterwards |
| Asking the same question twice in different words | Looks like progress, reads as not listening |
