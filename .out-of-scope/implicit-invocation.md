# Out of scope: letting the model start a grilling session on its own

`grill-me`, `grill-with-forms` and `grill-with-docs` set `disable-model-invocation: true`. Only `grilling` stays model-invocable.

## Why the three entries are user-only

A grilling session is a deliberate act: the user hands over a chunk of attention and expects to be interrogated. A model that decides on its own to start one turns an ordinary request into an unsolicited interview — and because the first round arrives as a card, it looks like the product asking, not the assistant.

Upstream makes the same choice, for the same reason.

## Why `grilling` is not

`grilling` is a library that the other three load. The `skill` tool enforces `isModelInvocable` **before** loading, so a `modelInvocable: false` grilling would be unreachable by its own callers, and each entry skill would have to inline the whole discipline.

So the asymmetry is load-bearing:

| Skill | modelInvocable | userInvocable | Reason |
|---|---|---|---|
| `grilling` | true | true | must be loadable by its callers and by the user |
| `grill-me` | false | true | a session is the user's decision |
| `grill-with-forms` | false | true | same |
| `grill-with-docs` | false | true | same, and it writes files |

## The cost

A user who wants the model to reach for this automatically cannot get it from the bundle. The workaround is one line in their own `AGENTS.md`:

> When a design decision is unclear, ask for go-ahead, then use `grill-with-forms`.

That keeps the preference per-user instead of shipping it as everyone's default.

## Related

- `assets/skills/grilling/SKILL.md` — the primitive the entries load
- [separate-provider-per-skill.md](separate-provider-per-skill.md) — why all four ship in one provider
