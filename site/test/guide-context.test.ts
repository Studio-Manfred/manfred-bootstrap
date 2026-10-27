import { describe, expect, test } from 'vitest'
import { buildGuideContext } from '../src/lib/guide-context'
import { PLUGINS_URL, REPO_URL, SITE_URL, EXAMPLES, NEW_PROJECT } from '../src/content/guide'
import { PLUGINS } from '../src/content/plugins'

describe('buildGuideContext', () => {
  const md = buildGuideContext()

  test.each([
    'What Manfred Bootstrap is',
    'Why it exists',
    'When to use it',
    'Prerequisites',
    'Quick start',
    'Examples',
    'Path A — New project',
    'Path B — Existing project',
    'Flags',
    'What gets installed or created',
    'Claude plugins',
    'Next steps',
    'Links',
  ])('has a section "%s"', (title) => {
    expect(md).toMatch(new RegExp(`^## ${title}$`, 'm'))
  })

  test('links the live guide, the plugins page and the repo', () => {
    expect(md).toContain(SITE_URL)
    expect(md).toContain(PLUGINS_URL)
    expect(md).toContain(REPO_URL)
  })

  test('is built from the same content the page renders', () => {
    for (const e of EXAMPLES) expect(md).toContain(e.command)
    for (const f of NEW_PROJECT.flags) expect(md).toContain(f.flag)
    for (const p of PLUGINS) expect(md).toContain(p.slug)
  })

  test('full plugin detail lists skills, compact keeps name and purpose and the link', () => {
    const full = buildGuideContext({ pluginDetail: 'full' })
    const compact = buildGuideContext({ pluginDetail: 'compact' })
    expect(full).toContain(PLUGINS[0].skills[0])
    expect(compact).not.toContain(PLUGINS[0].skills[0])
    expect(compact).toContain(PLUGINS[0].pitch)
    expect(compact).toContain(PLUGINS_URL)
    expect(compact.length).toBeLessThan(full.length)
  })
})
