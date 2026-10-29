# Attribution

This package's interview discipline and its glossary/ADR formats are adapted from
[mattpocock/skills](https://github.com/mattpocock/skills), distributed under the
MIT License.

Upstream copyright notice, as required by that license:

```
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## What came from where

| File here | Upstream source | What changed |
|---|---|---|
| `assets/skills/grilling/SKILL.md` | `skills/productivity/grilling/SKILL.md` | Rewritten for DSH: names the two entry skills, adds the `{ id, selected, custom }` answer shape, splits elaboration into `references/grilling.md` |
| `assets/skills/grill-me/SKILL.md` | `skills/productivity/grill-me/SKILL.md` | The upstream file is a one-line delegation to `grilling`; this one carries the open-question policy inline, because DSH's answer shape makes "no options" a real, separate mode |
| `assets/skills/grill-with-docs/SKILL.md` | `skills/engineering/grill-with-docs/SKILL.md` | Upstream delegates to `grilling` + `domain-modeling`; this one delegates to `grilling` and reads the card rules from the shared reference file, because DSH cannot load a user-only sibling skill |
| `assets/references/grilling.md` | `skills/productivity/grilling/SKILL.md` | Expanded into the full rule set (tree, frontier, question quality, wording, anti-patterns) |
| `assets/references/domain-modeling.md` | `skills/engineering/domain-modeling/SKILL.md` | Condensed; file-layout and session rules preserved |
| `assets/references/glossary-format.md` | `skills/engineering/domain-modeling/GLOSSARY-FORMAT.md` | Structure preserved, examples replaced |
| `assets/references/adr-format.md` | `skills/engineering/domain-modeling/ADR-FORMAT.md` | Structure and the three gates preserved, examples replaced |

Not derived from upstream:

- `index.js`, `lib/skills.js`, `test/skills.spec.mjs`, `cordis.patch.yml` — written for this bundle, modelled on the structure of `@deepseek-ai/dsh-skill-badge`.
- `assets/skills/grill-with-forms/SKILL.md` and `assets/references/form-batching.md` — the DSH question-card transport rules. Upstream deliberately has no equivalent: it lists "grilling through the harness's native question tool" as out of scope (`native-question-tool.md`). See `.out-of-scope/` for how that position is handled here.
- `assets/references/decision-log.md` — this package's own answer to upstream's open complaint that precise answers are lost to prose summarisation.

## Upstream position we diverge from

Upstream keeps grilling harness-neutral text and rejects native question UIs, on the grounds that structured pickers push the model towards multiple-choice questions with pre-baked answers. This bundle takes that criticism seriously rather than ignoring it:

- `/grill-me` keeps the open, no-options interview — the mode upstream is protecting.
- `/grill-with-forms` uses cards only where decisions are genuinely enumerable, and every question keeps the user's free-text answer.
- `references/grilling.md` forbids turning an open design question into a multiple choice just because a card can render it.
