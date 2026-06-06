import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs } from './bootstrap.mjs'
import { swapPlaceholders } from './bootstrap.mjs'

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
