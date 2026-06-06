# my-process — Ways of Working docs + scaffold + bootstrap

- **Date:** 2026-06-06
- **Status:** Approved design, ready for implementation planning
- **Author:** Jens Wedin (Manfred), with Claude Code
- **Spec type:** Brainstorming design doc (superpowers brainstorming → writing-plans)

## 1. Context

The `Code/` workspace holds ~63 independent projects. A consistent way of working (WoW)
has compounded across them but lives scattered: ~15 `CLAUDE.md`, the three-file agent
system (`AGENTS.md` → `CLAUDE.md` → `MEMORY.md`), per-project `knowledge/` folders with
`INDEX.md` + `ERRORS.md`, GitHub Actions CI, a Vitest + Playwright + axe testing pyramid,
Linear (`STU-NNN`) ticket discipline, Vercel deploys, and the in-house design system
`@studio-manfred/manfred-design-system`.

The most complete write-up already exists at `manfred-intranet/docs/ai-development-workflow.md`
(358 lines, 16 sections) plus a one-page `-overview.md`, and an existing reveal.js deck
(`my-process/presentations/`) draws on them. But that doc is intranet-flavoured
(Supabase / Deno / Clerk), so it cannot be reused as-is.

`my-process` is currently empty (only `presentations/`, not yet a git repo). It is the
clean target for consolidating the WoW into reusable form.

Adjacent repos checked and ruled out as the home for this:
- `starterkit/` — a stub (one `index.html`), no real scaffold.
- `manfred-shared-knowledge/` — a Claude *design-skills* plugin marketplace + brand/DESIGN
  references. Complementary, not an engineering scaffold.

So `my-process` fills a distinct gap: the **engineering / dev-workflow** WoW + a reusable
project scaffold for the Manfred team.

## 2. Goal

Turn `my-process` into a **GitHub template repository** that holds three things:

1. **Knowledge** — the WoW, generalized and project-agnostic, plus the compounded
   cross-repo knowledge distilled from every project.
2. **Canonical files** — a runnable Vite SPA starter with the WoW baked in (single source
   of truth).
3. **A distribution tool** — a dependency-free bootstrap script that stamps a new project
   from the starter, or applies the portable WoW overlay to an existing repo.

The docs are written so the existing reveal.js deck can later be re-skinned from them
without a rewrite.

## 3. Locked-in decisions

| Decision | Choice |
|---|---|
| Deliverable shape | Docs + scaffold + bootstrap script |
| Scaffold depth | Layered — runnable starter **and** portable overlay; bootstrap does `new` or `overlay` |
| Starter stack | Vite SPA, frontend-only (React 19 + TS + Vite + Tailwind v4 + shadcn/Radix + `@studio-manfred/manfred-design-system`) |
| Starter ↔ overlay coupling | **Approach A** — manifest-driven single source: `starter/` is canonical, `overlay.manifest.json` names the portable subset (no duplication, no drift) |
| Compounded knowledge home | `docs/knowledge/` (team-level, curated), distinct from `starter/knowledge/` (empty per-project flywheel template) |
| Presentation | Docs now (mapped to the deck's spine); reveal.js deck update is a later pass |
| Distribution | GitHub template repo + onboarding README |

## 4. Architecture & repository layout

```
my-process/
├── README.md                         # Onboarding front door: 60-sec pitch, "Use this template",
│                                     #   new-app vs add-to-existing, links to docs
├── CHANGELOG.md                      # Keep-a-Changelog
├── LICENSE
│
├── docs/                             # ── KNOWLEDGE (WoW, generalized & project-agnostic) ──
│   ├── ways-of-working.md            # Master, generalized from intranet's 16-section doc
│   ├── ways-of-working-overview.md   # One-pager, mirrors the deck's spine
│   ├── superpowers-workflow.md       # The superpowers skill chain in depth (see §5.1)
│   ├── stack-and-conventions.md      # Canonical stack + WHY; branching, commits, naming; DS connection
│   ├── using-this-repo.md            # How to consume the scaffold (bootstrap modes, placeholders)
│   ├── knowledge/                    # ── COMPOUNDED CROSS-REPO KNOWLEDGE (team base) ──
│   │   ├── INDEX.md                  #   routes to categories; "distilled from all Manfred repos"
│   │   ├── gotchas.md                #   recurring traps (see §5.2)
│   │   ├── domain.md                 #   product/brand/design-system context that recurs
│   │   └── procedural.md             #   cross-repo how-to: deploy, Linear discipline, ratchets, release
│   └── superpowers/specs/
│       └── 2026-06-06-my-process-wow-scaffold-design.md   # this doc
│
├── starter/                          # ── CANONICAL FILES (runnable Vite SPA + WoW baked in) ──
│   ├── AGENTS.md  CLAUDE.md  MEMORY.md
│   ├── knowledge/INDEX.md  knowledge/ERRORS.md
│   ├── .github/workflows/ci.yml
│   ├── .github/PULL_REQUEST_TEMPLATE.md
│   ├── eslint.config.js
│   ├── vitest.config.ts  test/setup.ts
│   ├── playwright.config.ts  e2e/a11y.spec.ts  e2e/example.spec.ts
│   ├── vercel.json  .npmrc
│   ├── src/  index.html  package.json  tsconfig*.json  vite.config.ts  components.json
│   └── README.md                     # the generated app's README (template)
│
├── scripts/
│   ├── bootstrap.mjs                 # modes: new | overlay; manifest-driven; placeholder swap
│   └── bootstrap.test.mjs            # node:test coverage of the script
│
└── overlay.manifest.json             # portable "drop-in" subset of starter/
```

Principle: `docs/` *describes*, `starter/` *is*. They never duplicate file content. The
overlay is not a folder — it is a manifest over `starter/`.

## 5. Components

### 5.1 Documentation set (`docs/`)

- **`ways-of-working.md`** — generalized from the intranet master. Keeps the 16 sections
  (one idea → brainstorming → planning → Linear → branching → TDD → testing pyramid →
  multi-agent → GitHub → CI → Vercel → security → linting → stack → knowledge flywheel →
  per-feature rhythm) so it maps onto the deck slide-for-slide. **Generalization rule:**
  every intranet-specific mechanism stays as the *concrete example*, but surrounding
  guidance is stack-agnostic — e.g. "E2E runs against a mock backend (in the intranet, a
  mock Supabase server; wire yours per project)." Nothing is lost; it just stops assuming
  Supabase/Deno/Clerk.
- **`ways-of-working-overview.md`** — one-pager: the pipeline, phases-at-a-glance, five
  principles, governance guardrails. Mirrors the deck's spine (Hook → Context → Journey →
  Solution → Evidence → Ask).
- **`superpowers-workflow.md`** — the skill chain in depth: brainstorming (hard-gate) →
  writing-plans → spec → executing-plans / subagent-driven-development /
  dispatching-parallel-agents → milestones → Linear epics/tickets (`STU-NNN`) → TDD →
  requesting/receiving-code-review → verification-before-completion →
  finishing-a-development-branch.
- **`stack-and-conventions.md`** — the canonical stack and why each choice; branching,
  conventional commits, file-naming conventions; how the design system connects (GitHub
  Packages auth, `import '@studio-manfred/manfred-design-system/styles'`, Storybook + MCP).
- **`using-this-repo.md`** — how to consume the scaffold: bootstrap `new` vs `overlay`,
  placeholders, what to edit first. Onboarding-flavoured; linked from the README.

### 5.2 Compounded knowledge (`docs/knowledge/`)

Team-level, curated, distinct from the per-project flywheel. Fed by promotion: when a
per-project `ERRORS.md` entry proves to be a recurring, cross-project truth, it graduates
**up** into here.

- `INDEX.md` — routes to categories; states this is distilled from all Manfred repos.
- `gotchas.md` — recurring traps, e.g. Tailwind v4 ≠ v3; design-system 401 / GitHub
  Packages PAT needs `read:packages`; Vite bakes `VITE_*` at build time (breaks E2E URL
  override); happy-dom ships a partial `localStorage`; react-hooks 7.x compiler errors.
- `domain.md` — product/brand/design-system context that recurs across projects.
- `procedural.md` — cross-repo how-to: deploy to Vercel, Linear write-discipline, the
  warn→enforce and `test.fail()` ratchets, the coverage ratchet, release flow.

### 5.3 Runnable starter (`starter/`)

A real, installable Vite SPA. Acceptance bar: a clean clone runs `npm install`, then
`lint`, `typecheck`, `test:run`, `coverage:check`, and `test:e2e` all green on the shipped
example.

- **App skeleton:** `package.json` with scripts mirroring the conventions (dev, build,
  preview, lint, typecheck, test, test:run, test:coverage, coverage:check, test:e2e,
  test:e2e:ui); Vite + Tailwind v4 via `@tailwindcss/vite`; shadcn `components.json`;
  `src/` with `main.tsx`, `App.tsx` importing the DS styles, `lib/utils.ts` (`cn()` via
  clsx + tailwind-merge), and one example unit test that exemplifies the "extract a small
  helper, don't test the giant component" tactic; `.npmrc` with the GitHub Packages
  registry line for the DS scope.
- **WoW files baked in (these are also the overlay):**
  - `AGENTS.md` — generic agent guidance (governance guardrails, the per-PR rhythm).
  - `CLAUDE.md` — `@AGENTS.md` import + project-specific template with `{{PLACEHOLDERS}}`.
  - `MEMORY.md` — seeded with the dated-entry format + one example entry.
  - `knowledge/INDEX.md` — empty flywheel scaffold (Domain / Procedural / Audit / Plans).
  - `knowledge/ERRORS.md` — the Symptom / Cause / Fix / Graduated-to format, no entries.
  - `.github/workflows/ci.yml` — `verify` job (lint + typecheck + unit + `coverage:check`)
    + `e2e` job; `paths-ignore: ["**/*.md"]`; `AXE_ENFORCE` wired but warn-only by default.
  - `.github/PULL_REQUEST_TEMPLATE.md` — summary, test plan, `Closes {{LINEAR_PREFIX}}-NNN`.
  - `eslint.config.js` — with `eslint-plugin-jsx-a11y` (a11y rules at `warn`, ratchet to
    `error`).
  - `vitest.config.ts` + `test/setup.ts` — RTL + jsdom + jest-dom.
  - `playwright.config.ts` — boots vite preview via `webServer`.
  - `e2e/a11y.spec.ts` — axe sweep, warn-only unless `AXE_ENFORCE=1`; `e2e/example.spec.ts`
    — one passing smoke test.
  - `vercel.json` — SPA rewrite to `/index.html`.

### 5.4 Overlay manifest (`overlay.manifest.json`)

Names the portable subset of `starter/` (everything in §5.3's WoW list, minus the
app-specific `src/` / `index.html` / `vite.config.ts` / app `package.json`). Shape:

```json
{
  "version": 1,
  "description": "Portable WoW overlay — drop into any repo, new or existing.",
  "files": [
    "AGENTS.md", "CLAUDE.md", "MEMORY.md",
    "knowledge/INDEX.md", "knowledge/ERRORS.md",
    ".github/workflows/ci.yml", ".github/PULL_REQUEST_TEMPLATE.md",
    "eslint.config.js", "vitest.config.ts", "test/setup.ts",
    "playwright.config.ts", "e2e/a11y.spec.ts", "vercel.json"
  ],
  "placeholders": ["PROJECT_NAME", "LINEAR_PREFIX", "DESCRIPTION"],
  "mergeHints": {
    "package.json": "Add these devDeps + scripts (printed by bootstrap, not overwritten)"
  }
}
```

### 5.5 Bootstrap script (`scripts/bootstrap.mjs`)

Single Node ESM script, zero runtime deps (`node:fs` / `node:path` / `node:readline`).

Usage:

```bash
# Mode 1 — stamp a brand-new project from the full starter
node scripts/bootstrap.mjs new --name acme-app --prefix STU --dir ../acme-app

# Mode 2 — add the WoW overlay to an existing repo
node scripts/bootstrap.mjs overlay --dir ../some-existing-repo --prefix STU
```

Behaviour & control flow:

1. **Parse args** (`mode`, `--name`, `--prefix`, `--dir`, `--description`, `--dry-run`,
   `--yes`, `--force`). Missing required values → interactive readline prompt, so it works
   with or without flags.
2. **Resolve file list** — `new` = whole `starter/` tree; `overlay` = manifest `files[]`.
3. **Collision check** — for each existing target file: in `overlay` mode prompt per-file
   `[s]kip / [o]verwrite / [d]iff`, default **skip**. `--yes` keeps the safe default;
   `--force` flips to overwrite. `package.json` is **never** overwritten — its deps/scripts
   are printed as a merge hint.
4. **Placeholder swap** — replace `{{PROJECT_NAME}}`, `{{LINEAR_PREFIX}}`,
   `{{DESCRIPTION}}` across copied text files.
5. **Report** — summary of files written/skipped, the package.json additions to make, and a
   "do this next" checklist (install, set the GitHub Packages `.npmrc` token, create the
   Linear project, push, set up Vercel).

Error handling:

- Target dir absent (`new`) → create it; present & non-empty → refuse unless `--force`.
- Target not a git repo (`overlay`) → warn, continue (overlay is just files).
- Manifest references a path missing from `starter/` → hard fail early with the offending
  path (a test enforces this).
- `--dry-run` prints the full plan and writes nothing.

Deliberately **not** in the script (YAGNI): no Linear API calls, no `gh repo create`, no
Vercel provisioning, no template engine. It copies files and swaps three tokens; everything
external stays a printed checklist the human runs.

## 6. Verification

- **Starter self-test (acceptance bar):** a clean `starter/` clone runs `npm install`, then
  `lint`, `typecheck`, `test:run`, `coverage:check`, `test:e2e` — all green.
- **Bootstrap tests (`scripts/bootstrap.test.mjs`, `node:test`):** `new` stamps + swaps
  placeholders into a temp dir; `overlay` copies only manifested files; existing files are
  skipped by default; `package.json` is never overwritten; `--dry-run` writes nothing;
  every path in `overlay.manifest.json` exists in `starter/` (the honesty check).
- **Docs link-check (light):** confirm internal doc links resolve. No heavy tooling.

## 7. Distribution

- `git init` in `my-process` (not yet a repo); conventional commits throughout.
- README front-loads the 60-second pitch, a "Use this template" section, the `new` vs
  `overlay` decision, and the one-time `.npmrc` GitHub-Packages token setup for the DS.
- Mark the repo as a **template repository** in GitHub settings — a manual checklist item
  for Jens (cannot be toggled from the CLI by the agent); called out in the README/handoff.
- Onboarding path for new Manfred devs: README → `using-this-repo.md` →
  `ways-of-working-overview.md` → deep-dive docs.

## 8. Presentation alignment (docs now, deck later)

`ways-of-working-overview.md` is written to mirror the existing deck's spine and its "five
principles" + "governance guardrails" slides, so the later deck update is a re-skin, not a
rewrite. The 16-section master maps onto the 24 slides. (A dedicated slide-to-source
`presentation-map.md` was considered and **skipped** for now by decision.)

## 9. Build sequencing (shape only; detail belongs to writing-plans)

1. Generalize the docs (`ways-of-working*.md`, `superpowers-workflow.md`,
   `stack-and-conventions.md`, `using-this-repo.md`).
2. Build the starter app and get it green (lint/typecheck/unit/coverage/e2e).
3. Add the WoW files + `overlay.manifest.json`.
4. Write `bootstrap.mjs` + `bootstrap.test.mjs`.
5. Distil `docs/knowledge/` (INDEX + gotchas + domain + procedural) from the repos.
6. Write README + onboarding docs.
7. `git init`, conventional commits, push; mark as template repo (manual).

## 10. Out of scope (YAGNI)

- The reveal.js deck edit itself (later pass).
- Linear / Vercel / `gh` automation.
- A second Next.js starter variant.
- Publishing the starter as an npm package.
- `presentation-map.md`.

## 11. Sources

Drawn read-only from the `Code/` workspace, primarily:
- `manfred-intranet/docs/ai-development-workflow.md` + `-overview.md` (the master narrative).
- `manfred-intranet`, `manfred-crm`, `manfred-analytics`, `manfred-up`,
  `manfred-design-system` (richest WoW examples: CLAUDE.md, knowledge/, ERRORS.md, CI).
- Parent `Code/CLAUDE.md` (global rules: testing, a11y, versioning, docs, learning).
- Cross-repo `package.json` aggregation (canonical stack + npm scripts).
- The existing deck outline at `my-process/presentations/`.
