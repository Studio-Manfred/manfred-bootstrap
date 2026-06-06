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

import { buildGithubCmd, buildVercelCmds, buildLinearMutation, shouldProvision } from './bootstrap.mjs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

test('buildGithubCmd defaults to private with push', () => {
  assert.deepEqual(buildGithubCmd({ PROJECT_NAME: 'acme' }, { public: false }),
    ['gh', ['repo', 'create', 'acme', '--source=.', '--remote=origin', '--push', '--private']])
})
test('buildGithubCmd --public flips visibility', () => {
  const [, args] = buildGithubCmd({ PROJECT_NAME: 'acme' }, { public: true })
  assert.ok(args.includes('--public') && !args.includes('--private'))
})

test('buildVercelCmds links the project then connects git', () => {
  assert.deepEqual(buildVercelCmds({ PROJECT_NAME: 'acme' }), [
    ['vercel', ['link', '--yes', '--project', 'acme']],
    ['vercel', ['git', 'connect']],
  ])
})

test('buildLinearMutation creates a project for a team', () => {
  const m = buildLinearMutation({ PROJECT_NAME: 'Acme App' }, 'team-123')
  assert.match(m.query, /projectCreate/)
  assert.deepEqual(m.variables, { name: 'Acme App', teamIds: ['team-123'] })
})

test('shouldProvision is off by default under --yes', async () => {
  assert.equal(await shouldProvision('github', { yes: true }, async () => 'y'), false)
})
test('shouldProvision honors an explicit flag', async () => {
  assert.equal(await shouldProvision('github', { github: true, yes: true }, async () => 'n'), true)
})
test('shouldProvision --no-provision overrides everything', async () => {
  assert.equal(await shouldProvision('github', { github: true, noProvision: true }, async () => 'y'), false)
})
test('shouldProvision asks interactively when no flag and not --yes', async () => {
  assert.equal(await shouldProvision('vercel', {}, async () => 'y'), true)
  assert.equal(await shouldProvision('vercel', {}, async () => 'n'), false)
})

test('CLI dry-run for `new` writes nothing and prints a plan', () => {
  const script = fileURLToPath(new URL('./bootstrap.mjs', import.meta.url))
  const r = spawnSync('node', [script, 'new', '--name', 'tmp-acme', '--prefix', 'STU',
    '--dir', '/tmp/__mp_dryrun_should_not_exist__', '--description', 'x', '--dry-run', '--yes'],
    { encoding: 'utf8' })
  assert.equal(r.status, 0)
  assert.match(r.stdout, /dry-run|plan/i)
  assert.equal(existsSync('/tmp/__mp_dryrun_should_not_exist__'), false)
})
