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

test('planCopy(overlay) skips existing files by default, never overwrites package.json', () => {
  const exists = (p) => ['CLAUDE.md', 'package.json'].includes(p)
  const plan = planCopy(['AGENTS.md', 'CLAUDE.md', 'package.json'], exists, { force: false, mode: 'overlay' })
  assert.deepEqual(plan.write, ['AGENTS.md'])
  assert.deepEqual(plan.skip, ['CLAUDE.md'])
  assert.deepEqual(plan.mergeHint, ['package.json'])
})

test('planCopy(overlay) with force overwrites existing but still protects package.json', () => {
  const exists = (p) => ['CLAUDE.md', 'package.json'].includes(p)
  const plan = planCopy(['CLAUDE.md', 'package.json'], exists, { force: true, mode: 'overlay' })
  assert.deepEqual(plan.write, ['CLAUDE.md'])
  assert.deepEqual(plan.mergeHint, ['package.json'])
})

test('planCopy(new) writes package.json into an empty target', () => {
  const plan = planCopy(['package.json', 'AGENTS.md'], () => false, { force: false, mode: 'new' })
  assert.deepEqual(plan.write, ['package.json', 'AGENTS.md'])
  assert.deepEqual(plan.mergeHint, [])
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

// ─── Role-based agents (STU-917) ──────────────────────────────────────────
// Helper + constants used by every role test below.

const AGENT_ROLES = [
  'strategist', 'analyst', 'designer', 'architect',
  'builder', 'tester', 'documenter', 'release-manager',
]
const ALLOWED_MODELS = ['opus', 'sonnet', 'haiku', 'fable']

function readFrontmatter(path) {
  const src = readFileSync(path, 'utf8')
  const match = src.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return null
  const fm = {}
  for (const line of match[1].split('\n')) {
    if (!line.includes(':')) continue
    const idx = line.indexOf(':')
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    fm[key] = value
  }
  return fm
}

test('every role file exists at starter/.claude/agents/ with required frontmatter keys', () => {
  for (const role of AGENT_ROLES) {
    const abs = new URL(`../starter/.claude/agents/${role}.md`, import.meta.url)
    assert.ok(existsSync(abs), `missing starter/.claude/agents/${role}.md`)
    const fm = readFrontmatter(abs)
    assert.ok(fm, `no frontmatter in ${role}.md`)
    for (const key of ['name', 'description', 'model']) {
      assert.ok(fm[key] && fm[key].length > 0,
        `frontmatter key '${key}' missing or empty in ${role}.md`)
    }
    assert.equal(fm.name, role, `name mismatch in ${role}.md`)
  }
})

test('every role file binds a model in the allowed lowercase set', () => {
  for (const role of AGENT_ROLES) {
    const abs = new URL(`../starter/.claude/agents/${role}.md`, import.meta.url)
    const fm = readFrontmatter(abs)
    assert.ok(ALLOWED_MODELS.includes(fm.model),
      `${role}.md has model='${fm.model}' (case-sensitive; allowed: ${ALLOWED_MODELS.join(', ')})`)
  }
})

test('bootstrap new --dry-run plan lists every .claude/agents/<role>.md', () => {
  const script = fileURLToPath(new URL('./bootstrap.mjs', import.meta.url))
  const r = spawnSync('node', [script, 'new', '--name', 'tmp-role-check', '--prefix', 'STU',
    '--dir', '/tmp/__mp_role_check_should_not_exist__', '--description', 'x', '--dry-run', '--yes'],
    { encoding: 'utf8' })
  assert.equal(r.status, 0, `bootstrap dry-run failed: ${r.stderr}`)
  for (const role of AGENT_ROLES) {
    assert.match(r.stdout, new RegExp(`\\.claude/agents/${role}\\.md`),
      `dry-run plan missing .claude/agents/${role}.md — dot-directory dropped by the walker?`)
  }
})

test('manifest lists every role agent file and knowledge/roles.md', () => {
  const manifest = JSON.parse(readFileSync(new URL('../overlay.manifest.json', import.meta.url)))
  for (const role of AGENT_ROLES) {
    assert.ok(manifest.files.includes(`.claude/agents/${role}.md`),
      `manifest missing .claude/agents/${role}.md`)
  }
  assert.ok(manifest.files.includes('knowledge/roles.md'),
    'manifest missing knowledge/roles.md')
  assert.equal(manifest.files.length, 25,
    `manifest expected 25 files, got ${manifest.files.length}`)
})

test('planCopy(overlay) skips a pre-existing agent file by default', () => {
  const exists = (p) => p === '.claude/agents/tester.md'
  const plan = planCopy(
    ['.claude/agents/tester.md', '.claude/agents/builder.md'],
    exists,
    { force: false, mode: 'overlay' },
  )
  assert.deepEqual(plan.write, ['.claude/agents/builder.md'])
  assert.deepEqual(plan.skip, ['.claude/agents/tester.md'])
})

test('top-level .claude/agents/*.md matches starter/.claude/agents/*.md byte-for-byte', () => {
  for (const role of AGENT_ROLES) {
    const topAbs = new URL(`../.claude/agents/${role}.md`, import.meta.url)
    const starterAbs = new URL(`../starter/.claude/agents/${role}.md`, import.meta.url)
    assert.ok(existsSync(topAbs), `missing top-level .claude/agents/${role}.md`)
    const top = readFileSync(topAbs)
    const starter = readFileSync(starterAbs)
    assert.ok(top.equals(starter),
      `.claude/agents/${role}.md differs between top-level and starter — copies drifted`)
  }
})

test('starter/AGENTS.md router lists every role by lowercase filename', () => {
  const agents = readFileSync(new URL('../starter/AGENTS.md', import.meta.url), 'utf8')
  const rolesHeadingIdx = agents.indexOf('## Roles')
  assert.ok(rolesHeadingIdx >= 0, "starter/AGENTS.md missing '## Roles' section")
  const rolesSection = agents.slice(rolesHeadingIdx)
  for (const role of AGENT_ROLES) {
    assert.match(rolesSection, new RegExp(`\\b${role}\\b`),
      `AGENTS.md Roles section does not name '${role}'`)
  }
})

test('bootstrap new next-steps section mentions role files at .claude/agents/', () => {
  const script = fileURLToPath(new URL('./bootstrap.mjs', import.meta.url))
  const r = spawnSync('node', [script, 'new', '--name', 'tmp-role-hint', '--prefix', 'STU',
    '--dir', '/tmp/__mp_role_hint_should_not_exist__', '--description', 'x', '--dry-run', '--yes'],
    { encoding: 'utf8' })
  assert.equal(r.status, 0, `bootstrap dry-run failed: ${r.stderr}`)
  const nextStepsIdx = r.stdout.indexOf('=== Next steps ===')
  assert.ok(nextStepsIdx >= 0, 'next-steps section missing from dry-run output')
  const nextSteps = r.stdout.slice(nextStepsIdx)
  assert.match(nextSteps, /\.claude\/agents\//,
    'next-steps output missing pointer to .claude/agents/ role files (spec §11)')
})
