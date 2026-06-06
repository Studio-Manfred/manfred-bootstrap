#!/usr/bin/env node
// Monotonic coverage ratchet. Fails if any metric drops more than TOLERANCE
// below .coverage-baseline.json. Bump the baseline up (never down) as coverage
// climbs. Reads coverage/coverage-summary.json (from `npm run test:coverage`).
import { readFileSync, writeFileSync } from 'node:fs'

const TOLERANCE = 0.5 // percentage points
const METRICS = ['statements', 'branches', 'functions', 'lines']

const summary = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'))
const baseline = JSON.parse(readFileSync('.coverage-baseline.json', 'utf8'))
const current = Object.fromEntries(METRICS.map((m) => [m, summary.total[m].pct]))

let failed = false
for (const m of METRICS) {
  const now = current[m]
  const base = baseline[m] ?? 0
  if (now < base - TOLERANCE) {
    failed = true
    console.error(`✗ ${m}: ${now}% is >${TOLERANCE}pp below baseline ${base}%`)
  } else {
    console.log(`✓ ${m}: ${now}% (baseline ${base}%)`)
  }
}

if (process.argv.includes('--update')) {
  const bumped = Object.fromEntries(
    METRICS.map((m) => [m, Math.max(current[m], baseline[m] ?? 0)]),
  )
  writeFileSync('.coverage-baseline.json', JSON.stringify(bumped, null, 2) + '\n')
  console.log('Baseline updated.')
}

process.exit(failed ? 1 : 0)
