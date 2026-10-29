# Changelog

All notable changes to this template are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); this repo is
versioned like a product.

## [Unreleased]

### Changed (STU-1190)
- Hero: "Add to an existing repo" is a blue outline, "Let AI guide you" a black outline.
- The "Let AI guide you" dialog shows a second state after a successful copy: "Prompt copied!", the paste hint (Cmd+V or Ctrl+V) and three links that open Claude, ChatGPT and Gemini in a new tab. The links are plain start pages with no prompt in the URL. A back chevron returns to the first state (copy and download). No desktop-app links.

### Added (STU-1188)
- Hero button "Let AI guide you" (third, outline) opens a modal (design-system `Dialog`): a real excerpt of the prompt, "Copy the prompt" (the button says "Copied", a status line inside the dialog says where to paste), and "Download Markdown version". The button has a local AI icon (`AiIcon`, a stub for the design-system icon `sparkles`, STU-1189). The site opens no app and has no `claude://` link.
- `bootstrap-guide-context.md` is the same text as the copy button (instruction + guide snapshot), emitted at build by `vite-plugin-guide-context.ts`.
- `site/src/content/guide.ts`: guide text moved out of the sections into one module. The sections, the snapshot (`lib/guide-context.ts`) and the prompt (`lib/claude-prompt.ts`) all read from it.

### Changed
- Starter dev dependencies upgraded so a fresh install audits clean. 13 advisories (2 critical) were all in dev tooling; `npm audit --omit=dev` was already 0. `npm audit fix` cleared 9 (vite, postcss, browserslist and others). `vitest` and `@vitest/coverage-v8` move from `^3.2.6` to `^4.1.12` for the other 4 (tinypool RCE, @vitest/mocker path traversal). Starter CI gains an `npm audit --omit=dev --audit-level=high` step. (STU-1200)
- Onboarding site now uses design-system components (PageShell/Header/Body/Footer, Typography, Button, Icon, Tabs, Card, Badge, Container, Stack, Logo, NavItem); removed custom SkipToContent. (STU-1037)
- Starter pins `@studio-manfred/manfred-design-system` at `^0.40.0` (was `^0.22.0`, which on a 0.x package never leaves 0.22.x). The starter AGENTS.md says to bump the range for each DS minor. (STU-1197)
- Starter CI runs the axe sweep with `AXE_ENFORCE: "1"` by default. A repo with existing a11y debt opts out with `"0"`. (STU-1197)

### Added
- `bootstrap.mjs new` checks the stamped files for leftover `{{PLACEHOLDER}}` tokens, lists each as `file:line`, and exits 1. GitHub Actions `${{ }}` expressions are ignored. (STU-1198)
- `--vercel` provisioning checks `GITHUB_TOKEN` in production, preview and development after `vercel link`. Interactive runs offer to run `vercel env add` for each missing environment. `--yes` runs print a loud warning with the exact commands. (STU-1201)
- Starter ships a `CHANGELOG.md` with an `[Unreleased]` section, and overlay copies it. (STU-1197)
- `install.sh` (also `scripts/install.sh`): curl-pipeable one-click installer that clones to a temp dir, runs `bootstrap.mjs`, and cleans up. Onboarding site gains an Examples section. (STU-1038)

### Fixed
- Docs no longer say the built-in Actions `GITHUB_TOKEN` reads the design system "in most cases". `using-this-repo.md` and `stack-and-conventions.md` now say it returns 403 until the package grants the repo access, and link the one-time grant step. (STU-1199)
- `bootstrap.mjs` now runs when invoked via a symlinked path (macOS `/var` -> `/private/var`).
- Starter `index.html` title is `{{PROJECT_NAME}}`, not "Manfred Starter". (STU-1197)
- Starter `.gitignore` covers `.vercel` and `.superpowers/`; `.env.example` stays tracked. (STU-1197)
- Starter AGENTS.md points learnings to `Studio-Manfred/manfred-bootstrap` → `docs/knowledge/`, not `my-process/`. (STU-1197)
- Starter `test/setup.ts` has the `globalThis.jest` fake-timer shim, so `userEvent` no longer hangs under `vi.useFakeTimers()`. The pattern is in `knowledge/ui-patterns.md`. (STU-1197)

### Added (earlier)
- Onboarding site at `/site/` — Vite + React + TS SPA with home + `/plugins` routes. See `docs/superpowers/specs/2026-10-04-onboarding-site-design.md`. (STU-1035)
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
