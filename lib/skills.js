/**
 * Bundled skill provider for the grill skills.
 *
 * Shapes follow `@deepseek-ai/dsh-skill-badge`: a static provider whose candidates
 * point at files under `assets/skills/`, and whose `resourceBase` exposes the whole
 * `assets/` directory so a loaded skill can resolve `references/*.md` by absolute
 * path. Sharing one base directory is why these skills can share reference files
 * without copying them, which the one-level filesystem provider cannot do.
 *
 * @module dsh-grill-with-forms/lib/skills
 */

import { readdir, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

/** Provider name registered on `ctx.skills`. */
export const PROVIDER_NAME = 'grill-with-forms'

/** Skills live here; one directory per skill holding a `SKILL.md`. */
export const SKILLS_DIR_URL = new URL('../assets/skills/', import.meta.url)

/** The whole assets tree is the resource base, so `references/` resolves for every skill. */
export const RESOURCE_BASE = Object.freeze({
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/', import.meta.url)),
})

/** Kebab-case identity required by the skill registry. */
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Bundled rank. Prefer the registry's own constant when the harness package
 * resolves; a standalone checkout or a plain `node --test` run has no
 * `@deepseek-ai/dsh-skill`, and the documented bundled rank is 600.
 */
let bundledRank = 600
try {
  const skillPackage = await import('@deepseek-ai/dsh-skill')
  if (typeof skillPackage.BUNDLED_SKILL_RANK === 'number') {
    bundledRank = skillPackage.BUNDLED_SKILL_RANK
  }
} catch {
  // Standalone checkout: keep the documented fallback.
}

/**
 * Strip frontmatter from a `SKILL.md` and read the keys this bundle uses.
 *
 * Deliberately a line-oriented parser rather than a YAML dependency: these files
 * are shipped by this package, and `test/skills.spec.mjs` rejects block scalars
 * and multi-line values so the parser can never silently disagree with a file.
 *
 * @param {string} text - raw file contents.
 * @returns {{ data: Record<string, string | boolean>, body: string }} parsed frontmatter and body.
 */
export function parseFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) return { data: {}, body: normalized }

  const closing = normalized.indexOf('\n---', 3)
  if (closing === -1) return { data: {}, body: normalized }

  const rawFrontmatter = normalized.slice(3, closing)
  const bodyStart = normalized.indexOf('\n', closing + 1)
  const body = bodyStart === -1 ? '' : normalized.slice(bodyStart + 1)

  /** @type {Record<string, string | boolean>} */
  const data = {}
  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const match = /^([A-Za-z][\w-]*):[ \t]*(.*)$/.exec(line.trimEnd())
    if (match === null) continue
    const key = match[1]
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1)
    }
    if (value === 'true') {
      data[key] = true
      continue
    }
    if (value === 'false') {
      data[key] = false
      continue
    }
    data[key] = value
  }
  return { data, body }
}

/**
 * Resolve the invocation policy from frontmatter.
 *
 * These are the same two keys the filesystem provider honours, so copying
 * `assets/skills/` into `~/.dsh/skills/` behaves identically to installing the
 * bundle. Omitted keys grant both surfaces, matching the registry default.
 *
 * @param {Record<string, string | boolean>} data - parsed frontmatter.
 * @returns {{ modelInvocable: boolean, userInvocable: boolean }} resolved policy.
 */
export function resolveInvocation(data) {
  return {
    modelInvocable: data['disable-model-invocation'] !== true,
    userInvocable: data['user-invocable'] !== false,
  }
}

/**
 * Read one skill directory into a candidate descriptor.
 *
 * @param {string} directory - skill directory name under `assets/skills/`.
 * @returns {Promise<import('@deepseek-ai/dsh-skill').SkillCandidate | undefined>} candidate, or undefined when the entry is not a skill.
 */
async function readCandidate(directory) {
  const fileUrl = new URL(`${directory}/SKILL.md`, SKILLS_DIR_URL)
  let text
  try {
    text = await readFile(fileUrl, 'utf8')
  } catch {
    return undefined
  }

  const { data } = parseFrontmatter(text)
  const declaredName = typeof data.name === 'string' ? data.name.trim() : ''
  // Ship the declared name only when it is a legal identity; otherwise fall back
  // to the directory, which is what a filesystem provider would also address.
  const skillName = NAME_PATTERN.test(declaredName) ? declaredName : directory
  const description = typeof data.description === 'string' ? data.description.trim() : ''
  if (description === '') return undefined

  return {
    name: skillName,
    description,
    invocation: resolveInvocation(data),
    provider: PROVIDER_NAME,
    source: 'bundled',
    resourceBase: RESOURCE_BASE,
    rank: bundledRank,
    locator: directory,
  }
}

/**
 * Build the provider registered on `ctx.skills`.
 *
 * `list` re-reads the directory on every call so editing a `SKILL.md` in a linked
 * development checkout takes effect without a host restart. Files are a few
 * kilobytes, and the registry only calls this on catalog invalidation.
 *
 * @returns {import('@deepseek-ai/dsh-skill').SkillProvider} read-only provider.
 */
export function createGrillProvider() {
  return {
    name: PROVIDER_NAME,
    async list() {
      let entries
      try {
        entries = await readdir(SKILLS_DIR_URL, { withFileTypes: true })
      } catch {
        return []
      }
      const directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort()

      const candidates = await Promise.all(directories.map(readCandidate))
      return candidates.filter(candidate => candidate !== undefined)
    },
    async get(candidate) {
      const directory = typeof candidate.locator === 'string' ? candidate.locator : candidate.name
      const fileUrl = new URL(`${directory}/SKILL.md`, SKILLS_DIR_URL)
      const text = await readFile(fileUrl, 'utf8')
      const { data, body } = parseFrontmatter(text)
      const declaredName = typeof data.name === 'string' ? data.name.trim() : ''
      const skillName = NAME_PATTERN.test(declaredName) ? declaredName : directory
      // A definition whose name drifts from the candidate is rejected by the
      // registry as a stale selection, so surface the mismatch here instead.
      if (skillName !== candidate.name) {
        throw new Error(
          `skill '${directory}' now declares name '${skillName}' but was listed as '${candidate.name}'`,
        )
      }
      return {
        name: skillName,
        description: typeof data.description === 'string' ? data.description.trim() : candidate.description,
        invocation: resolveInvocation(data),
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase: RESOURCE_BASE,
        content: body,
        metadata: { directory },
      }
    },
  }
}

/**
 * Report whether the shipped asset tree is present. Used by the package test so a
 * broken `files` list fails here rather than at load time in a host.
 *
 * @returns {Promise<boolean>} whether `assets/skills/` is a readable directory.
 */
export async function assetsPresent() {
  try {
    const info = await stat(SKILLS_DIR_URL)
    return info.isDirectory()
  } catch {
    return false
  }
}
