import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs } from './bootstrap.mjs'
import { swapPlaceholders } from './bootstrap.mjs'
import { resolveFileList } from './bootstrap.mjs'
import { planCopy } from './bootstrap.mjs'
import { readFileSync, existsSync } from 'node:fs'

test('parseArgs reads mode and flags', () => {
  const a = parseArgs(['new', '--name', 'acme', '--prefix', 'STU', '--dir', '../acme'])
  assert.equal(a.mode, 'new')
  assert.equal(a.name, 'acme')
  assert.equal(a.prefix, 'STU')
  assert.equal(a.dir, '../acme')
})

test('parseArgs reads boolean provisioning + safety flags', () => {
  const a = parseArgs(['overlay', '--dir', '.', '--github', '--no-provision', '--yes', '--dry-run'])
  assert.equal(a.mode, 'overlay')
  assert.equal(a.github, true)
  assert.equal(a.noProvision, true)
  assert.equal(a.yes, true)
  assert.equal(a.dryRun, true)
})

test('swapPlaceholders replaces all tokens', () => {
  const out = swapPlaceholders('{{PROJECT_NAME}} uses {{LINEAR_PREFIX}}-1 — {{DESCRIPTION}}', {
    PROJECT_NAME: 'acme', LINEAR_PREFIX: 'STU', DESCRIPTION: 'a demo',
  })
  assert.equal(out, 'acme uses STU-1 — a demo')
})

test('swapPlaceholders leaves unknown tokens untouched', () => {
  assert.equal(swapPlaceholders('{{UNKNOWN}}', { PROJECT_NAME: 'x' }), '{{UNKNOWN}}')
})

test('resolveFileList(overlay) returns manifest files', () => {
  const manifest = { files: ['AGENTS.md', 'vercel.json'] }
  assert.deepEqual(resolveFileList('overlay', manifest, () => ['ignored']), ['AGENTS.md', 'vercel.json'])
})

test('resolveFileList(new) returns the full walked tree', () => {
  const walk = () => ['package.json', 'src/main.tsx', 'AGENTS.md']
  assert.deepEqual(resolveFileList('new', { files: ['AGENTS.md'] }, walk), ['package.json', 'src/main.tsx', 'AGENTS.md'])
})

test('planCopy skips existing files by default, never plans package.json overwrite', () => {
  const exists = (p) => ['CLAUDE.md', 'package.json'].includes(p)
  const plan = planCopy(['AGENTS.md', 'CLAUDE.md', 'package.json'], exists, { force: false })
  assert.deepEqual(plan.write, ['AGENTS.md'])
  assert.deepEqual(plan.skip, ['CLAUDE.md'])
  assert.deepEqual(plan.mergeHint, ['package.json'])
})

test('planCopy with force overwrites existing (except package.json)', () => {
  const exists = (p) => ['CLAUDE.md', 'package.json'].includes(p)
  const plan = planCopy(['CLAUDE.md', 'package.json'], exists, { force: true })
  assert.deepEqual(plan.write, ['CLAUDE.md'])
  assert.deepEqual(plan.mergeHint, ['package.json'])
})

test('every overlay.manifest.json path exists in starter/', () => {
  const manifest = JSON.parse(readFileSync(new URL('../overlay.manifest.json', import.meta.url)))
  for (const rel of manifest.files) {
    const abs = new URL(`../starter/${rel}`, import.meta.url)
    assert.ok(existsSync(abs), `manifest references missing starter/${rel}`)
  }
})
