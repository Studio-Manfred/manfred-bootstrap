import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs } from './bootstrap.mjs'

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
