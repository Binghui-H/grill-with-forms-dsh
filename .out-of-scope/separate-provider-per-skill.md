# Out of scope: one bundle per skill, or pointing the filesystem provider at `assets/`

All four skills ship in one package through one custom provider. Two simpler-looking alternatives were rejected.

## Alternative A: four separate bundles

One npm package per skill would give each its own version and its own market entry. It also duplicates the interview discipline four times, or forces a fifth "shared" package that every other one depends on — a dependency graph to publish four Markdown files.

Worse, it does not solve sharing: each package's `resourceBase` is its own directory, so `references/grilling.md` would still be copied into each package unless the model is told about a path outside its own resource base. Skill resource bases are per-skill by design.

## Alternative B: ship `assets/skills/` and let `dsh-skill-filesystem` discover it

`dsh-skill-filesystem` scans fixed roots and accepts `customSkillDirs`, so a patch could point it at `assets/skills/`. Two problems:

1. **One resource base per bundle.** The filesystem provider sets `resourceBase` to the skill's own directory, so `references/*.md` would have to live inside every skill directory — six shared files copied four times, guaranteed to drift.
2. **Ownership.** The `web-app` bundle disables the host `skill-filesystem` row and lets agent presets own local discovery. A deployment-level patch that reconfigures that row would be fighting the preset model for a path that is, semantically, a bundled asset.

## Why the custom provider wins

`ctx.skills.registerProvider` lets this package declare all four candidates with a **single shared** `resourceBase` pointing at `assets/`:

```js
const RESOURCE_BASE = { kind: 'directory', path: <pkg>/assets/ }
```

Every loaded skill then receives `<skill_resources> Base directory: …/assets/`, and `references/grilling.md` resolves to one file, shared by all four — with no copying and no sync step. This is the same shape `@deepseek-ai/dsh-skill-badge` uses for its single bundled skill.

Registration happens at the deployment level (a bundle row in the profile), which lands the candidates in the registry's **global layer**: visible to every agent, regardless of preset.

## Trade-off accepted

The four skills version together — they are edited as one document set and always released as one unit. If one ever needs an independent release cadence, this decision should be revisited.

## Related

- [implicit-invocation.md](implicit-invocation.md)
- `lib/skills.js` — the provider
