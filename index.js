/**
 * Cordis plugin entry for the grilled-decision skills.
 *
 * The bundle ships Markdown skills, not a service: `apply` registers one bundled
 * skill provider on `ctx.skills` and does nothing else. No tools, no UI, no state.
 *
 * @module dsh-grill-with-forms
 */

import { createGrillProvider } from './lib/skills.js'

/** Cordis plugin name. */
export const name = 'grill-with-forms'

/** The skill registry is the only capability this bundle needs. */
export const inject = ['skills']

/**
 * Register the bundled skill provider.
 * @param {import('@deepseek-ai/cordis').Context} ctx - calling context.
 */
export function apply(ctx) {
  ctx.skills.registerProvider(createGrillProvider)
}
