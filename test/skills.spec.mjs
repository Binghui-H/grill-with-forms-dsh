/**
 * Package tests for the bundled skill tree.
 *
 * These run without the harness installed: `lib/skills.js` falls back to the
 * documented bundled rank when `@deepseek-ai/dsh-skill` does not resolve.
 *
 * The tests encode the file-format contract the provider depends on, so a broken
 * `assets/` tree fails here rather than silently vanishing from a host catalog.
 */

import assert from 'node:assert/strict'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'

import {
  PROVIDER_NAME,
  RESOURCE_BASE,
  SKILLS_DIR_URL,
  assetsPresent,
  createGrillProvider,
  parseFrontmatter,
  resolveInvocation,
} from '../lib/skills.js'

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DESCRIPTION_LIMIT = 500

/** Every skill directory currently shipped. */
async function skillDirectories() {
  const entries = await readdir(SKILLS_DIR_URL, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
}

test('the asset tree ships with the package', async () => {
  assert.equal(await assetsPresent(), true)
  assert.equal((await skillDirectories()).length > 0, true)
})

test('the resource base points at the assets directory', async () => {
  assert.equal(RESOURCE_BASE.kind, 'directory')
  const info = await stat(RESOURCE_BASE.path)
  assert.equal(info.isDirectory(), true)
  assert.match(RESOURCE_BASE.path, /assets[\\/]$/)
})

test('every skill directory yields one candidate', async () => {
  const provider = createGrillProvider()
  const candidates = await provider.list()
  const directories = await skillDirectories()

  assert.equal(provider.name, PROVIDER_NAME)
  assert.equal(candidates.length, directories.length)

  for (const candidate of candidates) {
    assert.match(candidate.name, NAME_PATTERN)
    assert.equal(candidate.provider, PROVIDER_NAME)
    assert.equal(candidate.source, 'bundled')
    assert.equal(typeof candidate.rank, 'number')
    assert.equal(typeof candidate.invocation.modelInvocable, 'boolean')
    assert.equal(typeof candidate.invocation.userInvocable, 'boolean')
    assert.deepEqual(candidate.resourceBase, RESOURCE_BASE)
  }

  const names = candidates.map(candidate => candidate.name)
  assert.equal(new Set(names).size, names.length, 'candidate names must be unique')
})

test('every description is single-line and inside the catalog budget', async () => {
  const candidates = await createGrillProvider().list()

  for (const candidate of candidates) {
    assert.equal(candidate.description.includes('\n'), false, `${candidate.name} description must be one line`)
    assert.equal(candidate.description.trim() === candidate.description, true)
    assert.equal(candidate.description.length > 0, true)
    assert.equal(
      candidate.description.length <= DESCRIPTION_LIMIT,
      true,
      `${candidate.name} description is ${candidate.description.length} chars, limit ${DESCRIPTION_LIMIT}`,
    )
  }
})

test('every skill loads a frontmatter-free body and keeps its listed name', async () => {
  const provider = createGrillProvider()
  const candidates = await provider.list()

  for (const candidate of candidates) {
    const definition = await provider.get(candidate)
    assert.equal(definition.name, candidate.name)
    assert.equal(definition.description, candidate.description)
    assert.equal(definition.content.startsWith('---'), false, `${candidate.name} body must not start with frontmatter`)
    assert.equal(definition.content.trim().length > 0, true)
  }
})

test('frontmatter declares a name matching its directory', async () => {
  const directories = await skillDirectories()

  for (const directory of directories) {
    const text = await readFile(new URL(`${directory}/SKILL.md`, SKILLS_DIR_URL), 'utf8')
    const { data } = parseFrontmatter(text)
    assert.equal(typeof data.name, 'string', `${directory} must declare a name`)
    assert.equal(data.name, directory, `${directory} declares a different name`)
  }
})

test('frontmatter values are single-line scalars the parser can read', async () => {
  const directories = await skillDirectories()
  const blockScalar = /:\s*[|>][+-]?\s*$/

  for (const directory of directories) {
    const text = await readFile(new URL(`${directory}/SKILL.md`, SKILLS_DIR_URL), 'utf8')
    const closing = text.indexOf('\n---', 3)
    assert.notEqual(closing, -1, `${directory} frontmatter must be closed`)
    const frontmatter = text.slice(3, closing)

    for (const line of frontmatter.split(/\r?\n/)) {
      assert.equal(blockScalar.test(line), false, `${directory} uses a block scalar: ${line}`)
      if (line.trim() === '' || line.startsWith('  ')) continue
      assert.match(line, /^[A-Za-z][\w-]*:[ \t]*.+$/, `${directory} has an unsupported frontmatter line: ${line}`)
    }
  }
})

test('invocation keys follow the filesystem provider semantics', () => {  assert.deepEqual(resolveInvocation({}), { modelInvocable: true, userInvocable: true })
  assert.deepEqual(resolveInvocation({ 'disable-model-invocation': true }), {
    modelInvocable: false,
    userInvocable: true,
  })
  assert.deepEqual(resolveInvocation({ 'user-invocable': false }), {
    modelInvocable: true,
    userInvocable: false,
  })
})

test('every reference a skill body links to exists in the asset tree', async () => {
  const provider = createGrillProvider()
  const candidates = await provider.list()

  for (const candidate of candidates) {
    const definition = await provider.get(candidate)
    const references = new Set(
      [...definition.content.matchAll(/references\/[A-Za-z0-9._-]+\.md/g)].map(match => match[0]),
    )
    for (const reference of references) {
      const info = await stat(join(RESOURCE_BASE.path, ...reference.split('/')))
      assert.equal(info.isFile(), true, `${candidate.name} links a missing ${reference}`)
    }
  }
})

test('a renamed skill is reported instead of returned stale', async () => {
  const provider = createGrillProvider()
  const [first] = await provider.list()
  if (first === undefined) return

  await assert.rejects(
    () => provider.get({ ...first, name: 'not-the-declared-name' }),
    /declares name/,
  )
})

test('the shipped skills keep their intended invocation policies', async () => {
  const byName = new Map((await createGrillProvider().list()).map(candidate => [candidate.name, candidate]))

  // `grilling` must stay model-invocable: the `skill` tool rejects a loaded
  // skill that is not, so the three entry skills could not delegate to it.
  // The entries stay user-only so a grilling session is never started unasked.
  const expected = {
    grilling: { modelInvocable: true, userInvocable: true },
    'grill-me': { modelInvocable: false, userInvocable: true },
    'grill-with-forms': { modelInvocable: false, userInvocable: true },
    'grill-with-docs': { modelInvocable: false, userInvocable: true },
  }

  assert.deepEqual([...byName.keys()].sort(), Object.keys(expected).sort())
  for (const [name, invocation] of Object.entries(expected)) {
    assert.deepEqual(byName.get(name).invocation, invocation, `${name} invocation policy changed`)
  }
})

test('no skill body asks the model to load a skill it cannot load', async () => {
  const provider = createGrillProvider()
  const candidates = await provider.list()
  const modelInvocable = new Map(candidates.map(candidate => [candidate.name, candidate.invocation.modelInvocable]))
  const offenders = []

  for (const candidate of candidates) {
    const { content } = await provider.get(candidate)
    for (const line of content.split(/\r?\n/)) {
      if (!/load and follow/i.test(line)) continue
      for (const [, referenced] of line.matchAll(/`([a-z][a-z0-9-]*)`/g)) {
        // Only sibling skills matter here: a referenced file or option name is
        // not something the `skill` tool would resolve.
        if (modelInvocable.get(referenced) === false) offenders.push(`${candidate.name} loads ${referenced}`)
      }
    }
  }

  assert.deepEqual(offenders, [], 'an entry skill delegated to a skill the model cannot load')

  // And the reverse mistake: an entry skill may *name* a sibling so the user can
  // re-run with it, but never claim to load it.
  for (const candidate of candidates) {
    const { content } = await provider.get(candidate)
    assert.equal(
      /Load and follow[^.]*`grill-with-(forms|docs)`/.test(content),
      false,
      `${candidate.name} still delegates to an entry skill`,
    )
  }
})

test('every entry point offers the decision log while the library stays out of it', async () => {
  const provider = createGrillProvider()
  const entries = new Set(['grill-me', 'grill-with-forms', 'grill-with-docs'])

  for (const candidate of await provider.list()) {
    const { content } = await provider.get(candidate)
    const offers = content.includes('references/decision-log.md')
    if (entries.has(candidate.name)) {
      assert.equal(offers, true, `${candidate.name} must offer the decision log at close`)
    } else {
      assert.equal(offers, false, `${candidate.name} must not own the decision log`)
    }
  }
})
