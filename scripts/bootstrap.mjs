#!/usr/bin/env node
import { fileURLToPath } from 'node:url'

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

async function main() {
  // wired in a later phase
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error(e); process.exit(1) })
}
