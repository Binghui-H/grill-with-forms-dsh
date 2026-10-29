# Form batching — DSH specifics

How `grill-with-forms` and `grill-with-docs` turn a frontier into one `ask_user_question` call. The interview logic lives in [grilling.md](grilling.md); this file is only about the transport.

## The tool

```json
{
  "questions": [
    {
      "id": "release_scope",
      "header": "Release scope",
      "question": "Do we ship desktop only for 0.1?",
      "options": [
        {
          "label": "Desktop only (Recommended)",
          "description": "Smallest surface we can support properly in one release."
        },
        { "label": "Desktop and web", "description": "Doubles the test matrix and the support surface." }
      ],
      "multi_select": false
    }
  ]
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable ASCII. Echoed back in every answer, so it is the key of your decision graph. |
| `question` | yes | One idea. The whole question the user reads. |
| `header` | no | Short label used by the card's navigation. |
| `options` | **no** | Omit it entirely for an open question; the user gets a text box. |
| `multi_select` | no | Only for genuinely independent choices. |
| `options[].label` | yes | What the user sees. This is where `(Recommended)` goes. |
| `options[].description` | no | The "why this matters" slot, rendered with the option. |

The answer comes back as:

```json
{ "answers": [{ "id": "release_scope", "selected": [], "custom": "只有桌面端" }] }
```

## Reading the answer shape

| Returned | Meaning | What you do |
|---|---|---|
| `selected: ["Desktop only (Recommended)"]` | The user clicked your recommendation | Record it |
| `selected: []`, `custom: "..."` | The user typed their own answer. On a single-select this **replaces** the selection | Treat `custom` as the decision |
| `selected: [...]`, `custom: "..."` | Multi-select with an extra note | Record both: the labels, plus the note |
| `selected: []`, no `custom` | Skipped via the card's skip action | Mark the decision **open**; do not fill it in |
| Tool returned an error | No question provider, or the request was rejected | Degrade to prose questions and say so |

The typed-answer case is not an edge case. Expect it: a free-text box in front of the user will get used, and on a single-select the UI deliberately clears `selected` so the two can never disagree.

## Batch sizing

| Boundary | Value | What to do at the boundary |
|---|---|---|
| Ready set of 1–2 | — | Ask them **as-is**. Never pad to reach 3 |
| Comfortable batch | 3–6 questions | Aim here for a normal round |
| Hard ceiling | 8 questions | Split along dependency order into two rounds |
| Options per question | 2–8 | Split the decision, or make it a free-text question |
| Options: fewer than 2 | — | Not a pick-list question. Drop `options`; ask it open |

Splitting is by the decision graph, never by whatever order the questions were generated in. Two questions that are independent can be split arbitrarily; two that are not must land in different rounds.

**One round is exactly one call.** Never chain a second card in the same round to catch questions the first card could have carried — that spends an extra submit and buys nothing. A second card is only justified when the answers to the first **created** new questions that did not exist before.

Likewise, a small ready set is not a reason to wait. If one decision is ready and everything else depends on it, ask the one question. Pulling an unready question forward to fill the batch means guessing at an answer, which is the one thing batching exists to prevent.

## Option wording

- The recommended option goes **first**, and its label ends with `(Recommended)`. This is the only recommendation channel the card has.
- Labels stay short — a decision, not a sentence. Put the trade-off in `description`.
- Never pad. Two honest options beat five where three are filler; a padded list is what makes people distrust the whole card.
- Enumeration only. If you cannot list the real alternatives, leave `options` off and ask open.

## When the form surface is unavailable

The tool is mounted per agent preset, and it can be absent. If `ask_user_question` is not available, or returns an error:

1. Say so in one line — "the question card is unavailable, asking in prose".
2. Ask the same frontier as numbered prose questions, each with its recommendation.
3. Keep the same dependency discipline. Nothing else changes.

Never simulate a card. A bullet list of `○`/`☐` marks is not a form, and calling it one breaks the user's trust in every later claim about what was answered.

## What this transport must not change

The point of `grilling` is that the user thinks. A card makes answering cheap; it must not make thinking optional.

- Do not turn an open design question into a multiple choice because a card can render it.
- Do not batch a question whose options depend on an answer you have not read yet.
- Do not let the card's convenience push you past the frontier — the ceiling on a card is 8 questions, the ceiling on a round is "everything that is actually ready".
