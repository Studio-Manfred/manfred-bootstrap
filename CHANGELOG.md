# Changelog

All notable changes to this template are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this repo is
versioned like a product.

## [Unreleased]

### Added
- Design-system access checklist for new DS-consuming repos (STU-645): package
  "Manage Actions access" grant for CI and Vercel `GITHUB_TOKEN` env var, printed
  by `bootstrap.mjs` next-steps and documented in `docs/stack-and-conventions.md`
  and `docs/knowledge/gotchas.md`.
- `starter/knowledge/ui-patterns.md` — seeded UI patterns from manfred-workshops
  (clickable card via stretched link, card footer with actions, DS icon-gap
  stopgap) (STU-652).
- Seeded stack gotchas in `starter/knowledge/ERRORS.md`: TanStack Query v5
  `mutationFn` phantom 2nd argument, PGlite + parallel Vitest hook timeouts
  (STU-652).
- **Role-based agents (STU-917).** Eight named roles (strategist, analyst,
  designer, architect, builder, tester, documenter, release-manager) shipped
  as `.claude/agents/*.md` files with per-role Claude model bindings
  (Fable / Opus / Sonnet / Haiku). Convention doc at `starter/knowledge/roles.md`;
  router in `starter/AGENTS.md`. Distributed via the overlay manifest
  (16 → 25 files). Top-level `.claude/agents/` mirrors the starter copy
  byte-for-byte (test-enforced).
- **DS-first convention (STU-977).** Consumer `designer` role now checks
  `manfred-design-system` for coverage before building UI, files a ticket
  in the Studio Manfred "Design System" Linear project when the DS lacks
  a component, and stubs locally under `src/components/_ds-stubs/` with a
  `TODO(STU-NNN)` marker. `release-manager` role now greps for those
  markers on `npm update @studio-manfred/*` and opens swap-PRs when the
  DS ticket closes. Companion ticket STU-978 adds the receiving
  `ds-designer` role in the DS repo.

### Changed
- `starter/AGENTS.md`: changelog entries must merge into the existing heading
  under `[Unreleased]`; documented the throwaway-Playwright-spec pattern as the
  sanctioned visual verification for UI changes (STU-652).

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
