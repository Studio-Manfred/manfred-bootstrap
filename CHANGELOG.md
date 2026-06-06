# Changelog

All notable changes to this template are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this repo is
versioned like a product.

## [Unreleased]

## [0.1.0] - 2026-06-06

### Added
- `docs/` — ways-of-working overview, full WoW reference, stack-and-conventions,
  superpowers-workflow, using-this-repo guide, and a structured knowledge base
  (`knowledge/INDEX.md`, domain, procedural, gotchas, errors).
- `starter/` — runnable Vite + React + TypeScript SPA with CI, Playwright E2E,
  axe accessibility checks, coverage ratchet, and private design-system
  reference via GitHub Packages.
- `overlay.manifest.json` — declares the portable WoW file set that can be
  dropped onto any existing repo.
- `scripts/bootstrap.mjs` — dependency-free bootstrap tool; supports `new` and
  `overlay` modes with optional `--github`, `--vercel`, and `--linear`
  provisioning flags.
- `scripts/bootstrap.test.mjs` — node:test suite for the bootstrap script.
- `README.md` — front-door onboarding guide with repo map and quickstart.
- `docs/HANDOFF.md` — manual post-bootstrap steps for a human operator.
