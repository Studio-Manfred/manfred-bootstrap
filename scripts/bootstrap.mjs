#!/usr/bin/env node
import { fileURLToPath } from 'node:url'
import {
  readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync,
} from 'node:fs'
import { join, dirname, resolve, basename } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const STARTER = join(ROOT, 'starter')
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', 'playwright-report', 'test-results'])
const BINARY_RE = /\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|pdf|zip)$/i

const BOOL_FLAGS = new Set([
  'github', 'vercel', 'linear', 'no-provision', 'public',
  'linear-seed', 'yes', 'dry-run', 'force',
])
const VALUE_FLAGS = new Set(['name', 'prefix', 'dir', 'description', 'linear-team'])

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

export function parseArgs(argv) {
  const out = { mode: undefined }
  if (argv[0] && !argv[0].startsWith('--')) out.mode = argv[0]
  for (let i = out.mode ? 1 : 0; i < argv.length; i++) {
    const tok = argv[i]
    if (!tok.startsWith('--')) continue
    const key = tok.slice(2)
    if (BOOL_FLAGS.has(key)) out[camel(key)] = true
    else if (VALUE_FLAGS.has(key)) out[camel(key)] = argv[++i]
  }
  return out
}

export function swapPlaceholders(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m))
}

export function resolveFileList(mode, manifest, walkFn) {
  if (mode === 'overlay') return [...manifest.files]
  if (mode === 'new') return walkFn()
  throw new Error(`Unknown mode: ${mode}`)
}

export function planCopy(files, existsFn, { force, mode }) {
  const plan = { write: [], skip: [], mergeHint: [] }
  for (const f of files) {
    // Only protect an existing package.json when overlaying onto an existing
    // repo. In `new` mode the target is empty, so package.json must be written.
    if (f === 'package.json' && mode === 'overlay') { plan.mergeHint.push(f); continue }
    if (existsFn(f) && !force) plan.skip.push(f)
    else plan.write.push(f)
  }
  return plan
}

export function buildGithubCmd(vars, { public: isPublic }) {
  return ['gh', ['repo', 'create', vars.PROJECT_NAME, '--source=.', '--remote=origin', '--push', isPublic ? '--public' : '--private']]
}

export function buildVercelCmds(vars) {
  return [
    ['vercel', ['link', '--yes', '--project', vars.PROJECT_NAME]],
    ['vercel', ['git', 'connect']],
  ]
}

export function buildLinearMutation(vars, teamId) {
  return {
    query: `mutation ProjectCreate($name: String!, $teamIds: [String!]!) {
      projectCreate(input: { name: $name, teamIds: $teamIds }) { success project { id url } }
    }`,
    variables: { name: vars.PROJECT_NAME, teamIds: [teamId] },
  }
}

// askFn(question) -> Promise<string>. Returns whether to run integration `name`.
export async function shouldProvision(name, args, askFn) {
  if (args.noProvision) return false
  if (args[name] === true) return true
  if (args.yes) return false // safe default in non-interactive runs
  const ans = await askFn(`Create ${name} resource for this project? [y/N] `)
  return /^y(es)?$/i.test((ans || '').trim())
}

// ---- thin IO helpers (logic lives in the pure functions above) ----

export function walkStarter(base = STARTER, prefix = '') {
  const out = []
  for (const entry of readdirSync(base)) {
    if (SKIP_DIRS.has(entry)) continue
    const abs = join(base, entry)
    const rel = prefix ? `${prefix}/${entry}` : entry
    if (statSync(abs).isDirectory()) out.push(...walkStarter(abs, rel))
    else out.push(rel)
  }
  return out
}

function hasTool(bin) {
  try { return spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0 }
  catch { return false }
}

function run(bin, args, opts = {}) {
  return spawnSync(bin, args, { stdio: 'inherit', ...opts })
}

async function linearGraphQL(key, query, variables) {
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: key },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join('; '))
  return json.data
}

async function createLinearProject(key, teamKey, vars, args) {
  const data = await linearGraphQL(
    key,
    `query Team($key: String!) { teams(filter: { key: { eq: $key } }) { nodes { id key } } }`,
    { key: teamKey },
  )
  const teams = data?.teams?.nodes ?? []
  if (teams.length !== 1) {
    console.log(`Linear: expected exactly one team with key ${teamKey}, found ${teams.length} — create the project manually.`)
    return
  }
  const teamId = teams[0].id
  const m = buildLinearMutation(vars, teamId)
  const created = await linearGraphQL(key, m.query, m.variables)
  const url = created?.projectCreate?.project?.url
  console.log('Linear: project created' + (url ? ` — ${url}` : ''))
  if (args.linearSeed) {
    const projectId = created?.projectCreate?.project?.id
    await linearGraphQL(
      key,
      `mutation Seed($teamId: String!, $title: String!, $projectId: String!) { issueCreate(input: { teamId: $teamId, title: $title, projectId: $projectId }) { success } }`,
      { teamId, title: `Scaffold ${vars.PROJECT_NAME}`, projectId },
    )
    console.log('Linear: seeded first issue.')
  }
}

async function provision(name, args, askFn, dry, vars, targetDir) {
  if (!(await shouldProvision(name, args, askFn))) return
  try {
    if (name === 'github') {
      const hasOrigin = spawnSync('git', ['remote', 'get-url', 'origin'], { cwd: targetDir, stdio: 'ignore' }).status === 0
      if (hasOrigin) { console.log('GitHub: origin remote already exists — skipping repo create.'); return }
      if (!hasTool('gh')) { console.log(`GitHub: \`gh\` not found — manually: gh repo create ${vars.PROJECT_NAME} --source=. --remote=origin --push`); return }
      const [bin, cmdArgs] = buildGithubCmd(vars, { public: !!args.public })
      if (dry) { console.log('DRY github:', bin, cmdArgs.join(' ')); return }
      run(bin, cmdArgs, { cwd: targetDir })
    } else if (name === 'vercel') {
      if (!hasTool('vercel')) { console.log('Vercel: CLI not found — run `vercel link` then `vercel git connect` manually.'); return }
      const cmds = buildVercelCmds(vars)
      if (dry) { cmds.forEach(([b, a]) => console.log('DRY vercel:', b, a.join(' '))); return }
      for (const [b, a] of cmds) run(b, a, { cwd: targetDir })
    } else if (name === 'linear') {
      const key = process.env.LINEAR_API_KEY
      if (!key) { console.log(`Linear: LINEAR_API_KEY not set — create a project "${vars.PROJECT_NAME}" in Linear manually.`); return }
      const teamKey = args.linearTeam || vars.LINEAR_PREFIX
      if (dry) { console.log(`DRY linear: resolve team ${teamKey} then projectCreate ${vars.PROJECT_NAME}`); return }
      await createLinearProject(key, teamKey, vars, args)
    }
  } catch (e) {
    console.warn(`${name} provisioning failed (continuing): ${e.message}`)
  }
}

function printNextSteps(mode, vars, targetDir) {
  console.log('\n=== Next steps ===')
  console.log(`1. cd ${targetDir}`)
  console.log('2. Provide a GitHub token with read:packages:  export GITHUB_TOKEN=$(gh auth token)')
  console.log('3. npm install')
  if (mode === 'new') console.log('4. Push to GitHub, set up Vercel, and create the Linear project if not auto-provisioned.')
  console.log('5. Edit CLAUDE.md project specifics + README.')
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const rl = createInterface({ input, output })
  const ask = (q) => rl.question(q)
  try {
    if (!['new', 'overlay'].includes(args.mode)) {
      console.error('Usage: bootstrap.mjs <new|overlay> --dir <path> [--name X --prefix STU --description "..."]')
      console.error('       [--github --vercel --linear --linear-team KEY --linear-seed] [--no-provision] [--public] [--yes --force --dry-run]')
      process.exitCode = 1
      return
    }
    const dir = args.dir || (await ask('Target directory: '))
    const targetDir = resolve(process.cwd(), dir)
    const name = args.name || (args.mode === 'new' ? (await ask('Project name: ')) : basename(targetDir))
    const prefix = args.prefix || (await ask('Linear team prefix (e.g. STU): '))
    const description = args.description || ''
    const vars = { PROJECT_NAME: name, LINEAR_PREFIX: prefix, DESCRIPTION: description }
    const dry = !!args.dryRun

    const manifest = JSON.parse(readFileSync(join(ROOT, 'overlay.manifest.json'), 'utf8'))
    const files = resolveFileList(args.mode, manifest, () => walkStarter())

    if (args.mode === 'new') {
      if (existsSync(targetDir) && readdirSync(targetDir).length > 0 && !args.force) {
        console.error(`Target ${targetDir} exists and is not empty. Use --force to proceed.`)
        process.exitCode = 1
        return
      }
      if (!dry) mkdirSync(targetDir, { recursive: true })
    } else if (!existsSync(targetDir)) {
      console.error(`Target ${targetDir} does not exist (overlay mode needs an existing repo).`)
      process.exitCode = 1
      return
    }

    const plan = planCopy(files, (rel) => existsSync(join(targetDir, rel)), { force: !!args.force, mode: args.mode })

    if (args.mode === 'overlay' && !args.yes && !args.force && !dry) {
      for (const f of [...plan.skip]) {
        const ans = await ask(`${f} exists. [s]kip / [o]verwrite? (s) `)
        if (/^o/i.test(ans.trim())) { plan.skip = plan.skip.filter((x) => x !== f); plan.write.push(f) }
      }
    }

    if (dry) {
      console.log('--- DRY RUN: planned actions (no files written) ---')
      console.log('write:', plan.write.join(', ') || '(none)')
      console.log('skip :', plan.skip.join(', ') || '(none)')
      console.log('package.json:', plan.mergeHint.length ? 'merge hint (never overwritten)' : '(n/a)')
    } else {
      for (const rel of plan.write) {
        const raw = readFileSync(join(STARTER, rel))
        const destAbs = join(targetDir, rel)
        mkdirSync(dirname(destAbs), { recursive: true })
        if (BINARY_RE.test(rel)) writeFileSync(destAbs, raw)
        else writeFileSync(destAbs, swapPlaceholders(raw.toString('utf8'), vars))
      }
      console.log(`Wrote ${plan.write.length} files to ${targetDir}`)
      if (plan.skip.length) console.log(`Skipped existing: ${plan.skip.join(', ')}`)
    }

    if (plan.mergeHint.length && !dry) {
      const starterPkg = JSON.parse(readFileSync(join(STARTER, 'package.json'), 'utf8'))
      console.log('\npackage.json was NOT overwritten. Merge these into your existing one:')
      console.log('scripts:', JSON.stringify(starterPkg.scripts, null, 2))
      console.log('devDependencies:', JSON.stringify(starterPkg.devDependencies, null, 2))
    }

    if (args.mode === 'new' && !dry && !existsSync(join(targetDir, '.git'))) {
      run('git', ['init'], { cwd: targetDir })
      run('git', ['add', '-A'], { cwd: targetDir })
      run('git', ['commit', '-m', 'chore: scaffold from my-process template'], { cwd: targetDir })
    }

    if (!args.noProvision) {
      await provision('github', args, ask, dry, vars, targetDir)
      await provision('vercel', args, ask, dry, vars, targetDir)
      await provision('linear', args, ask, dry, vars, targetDir)
    }

    printNextSteps(args.mode, vars, targetDir)
  } finally {
    rl.close()
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error(e); process.exit(1) })
}
