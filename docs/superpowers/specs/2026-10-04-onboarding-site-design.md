# Onboarding Site — Design Spec

**Status:** Approved for planning
**Owner:** Jens Wedin
**Date:** 2026-10-04
**Linear:** STU-985 (adjacent; may spawn its own ticket)

---

## 1. Intent

Give Manfred colleagues one page they can open to go from "I've never used `manfred-bootstrap`" to "I have a project stamped, Claude Code loaded with Manfred's skills, and a Linear-anchored branch ready" — in under 60 seconds for the happy path.

The site documents two things that go together:

1. **manfred-bootstrap** — stamps a new project (`new`) or layers the way-of-working onto an existing repo (`overlay`).
2. **manfred-shared-knowledge** — the Claude Code plugin marketplace (11 plugins) that gives Claude the skills and commands it uses while working in a bootstrapped project.

Both are useful alone; together they are the Manfred default stack.

## 2. Audience

Manfred colleagues only. Internal tool. Can assume:

- Studio Manfred GitHub org membership (private DS access via `@studio-manfred` on GitHub Packages).
- Linear account with the Studio Manfred workspace.
- Claude Code CLI installed.
- Familiarity with the Manfred vocabulary (WoW, DS, Linear-prefixed branches, superpowers).

Tone: second person, terse, opinionated, no marketing fluff.

## 3. Success criteria

- A colleague opens the site, picks their path (new / existing), copies the command, and runs it successfully within 60 seconds.
- A second-time visitor can jump straight to the plugins page and reinstall a specific plugin without rereading the overview.
- Zero axe violations on both routes in both themes.
- Site deploys from `manfred-bootstrap`'s `main` branch to Vercel; preview URLs on every PR.
- Content stays in lockstep with the bootstrap commands and plugin list it describes (collocation makes drift visible).

## 4. Scope

### In scope

- One Vite + React + TypeScript SPA at `/site/` inside the `manfred-bootstrap` repo.
- Home page with 8 content sections (see §6).
- `/plugins` subpage listing all 11 plugins from `manfred-shared-knowledge`.
- Interactive affordances: copy-to-clipboard command blocks, new-vs-existing path toggle, light/dark/system theme toggle, sticky anchor nav.
- Full accessibility pass (WCAG 2.2 AA, keyboard, screen reader, reduced motion).
- Vitest unit tests for stateful components; one Playwright golden-path E2E; axe-playwright on both routes.
- GitHub Actions `site` job gated to `site/**` changes.
- Vercel deployment, Root Directory = `site`.
- `site/README.md`, `site/CHANGELOG.md`, root `CHANGELOG.md` + `MEMORY.md` + `README.md` updates.

### Out of scope

- Agent-by-agent breakdown of the 8 roles (link to `docs/superpowers-workflow.md`).
- Full Way-of-Working rationale (link to `docs/ways-of-working.md`).
- DS component gallery (link to the DS repo).
- STU-985 venture context (wrong audience).
- Public marketing surface — this is colleague-facing only.
- Analytics, search, MDX, i18n, PWA/offline, auth.
- Changes to `manfred-shared-knowledge` itself; the site only reads the public plugin list.

## 5. Architecture

### 5.1 Stack

- **Build:** Vite 5+
- **Language:** TypeScript (strict)
- **Framework:** React 18
- **Routing:** `react-router-dom` v6, two routes: `/` and `/plugins`
- **Design System:** `@studio-manfred` via GitHub Packages (same `.npmrc` + `GITHUB_TOKEN` pattern as `starter/`)
- **State:** none beyond `useState` and `localStorage` for theme
- **Styling:** DS tokens + minimal page-level composition CSS; no bespoke design system

### 5.2 Folder layout (inside `/site/`)

```
site/
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.node.json
  .npmrc                 # points @studio-manfred to GitHub Packages via $GITHUB_TOKEN
  index.html
  src/
    main.tsx
    App.tsx              # Router root + layout
    routes/
      Home.tsx
      Plugins.tsx
    sections/            # one file per home-page section (§6)
      Hero.tsx
      Why.tsx
      WhenToUse.tsx
      QuickStart.tsx
      NewProject.tsx
      ExistingProject.tsx
      ClaudeSetup.tsx
      NextSteps.tsx
    components/
      CommandBlock.tsx
      PathTabs.tsx
      PluginCard.tsx
      ThemeToggle.tsx
      AnchorNav.tsx
      SkipToContent.tsx
    content/
      plugins.ts         # typed list; mirrors manfred-shared-knowledge README
    styles/
      tokens.css         # imports DS tokens; no custom tokens
  public/                # favicon, og image later
  test/                  # Vitest + Testing Library specs
  e2e/                   # Playwright specs
  playwright.config.ts
  vitest.config.ts
  README.md
  CHANGELOG.md
  vercel.json
```

### 5.3 Deploy

- Vercel project linked to `manfred-bootstrap`, Root Directory = `site`.
- `GITHUB_TOKEN` env var set via `vercel env add GITHUB_TOKEN production` (per repo CLAUDE.md).
- Preview URLs on every PR; production on `main`.
- Access: unlisted URL for now; add Vercel password protection or Cloudflare Access if the URL leaks.

### 5.4 Theming

- Three-state toggle: `light` / `dark` / `system`.
- First visit: `system` (reads `prefers-color-scheme`).
- Persisted to `localStorage` under key `manfred.theme`.
- Applied via `data-theme` attribute on `<html>`; DS tokens respond to it.
- `prefers-reduced-motion` disables theme transition animations.

## 6. Information architecture

Single-scroll home page, sticky anchor nav. Approx. 1500 words of content on home.

| # | Section | Anchor | Content |
|---|---------|--------|---------|
| 1 | Hero | `#top` | 1-sentence pitch; two CTAs: *Start a new project* (scrolls to `#new`), *Add to an existing repo* (scrolls to `#existing`) |
| 2 | Why this exists | `#why` | 5 outcome bullets: ship faster with Claude pre-wired · DS-first · Linear-anchored branches · CI/E2E/axe/coverage from day one · 8 role-based agents · same WoW everywhere |
| 3 | When to use it | `#when` | **Use it when:** starting a new Manfred project · adding WoW to an existing repo missing it. **Don't use it when:** working in a client-owned repo (unless cleared) · building a one-week throwaway prototype |
| 4 | Quick start | `#start` | Prereqs line (gh auth · Node 20+ · Claude Code CLI); single `bootstrap new` `CommandBlock`; "open it in Claude Code" line; link down to full paths |
| 5 | Path A — New project | `#new` | `node scripts/bootstrap.mjs new --name … --prefix STU --dir …` with flags table (`--github`, `--vercel`, `--linear`); what ships (CI, Playwright, axe, DS, 8 agents); first-ticket suggestion |
| 6 | Path B — Existing project | `#existing` | `node scripts/bootstrap.mjs overlay --dir ../existing-repo --prefix STU`; what `overlay.manifest.json` ships vs starter-only; non-destructive note; conflict resolution tip |
| 7 | Give Claude superpowers | `#claude` | Why (skills Claude uses while coding); 2-step install (`/plugin marketplace add Studio-Manfred/manfred-shared-knowledge` → `/plugin install …@manfred`); optional `install.sh` for home CLAUDE.md; CTA to `/plugins` |
| 8 | Next steps | `#next` | Open Linear team · read `docs/ways-of-working-overview.md` + `docs/superpowers-workflow.md` · MEMORY.md convention · how to ask for help |

### `/plugins` subpage

All 11 plugins from `manfred-shared-knowledge`, grouped by discipline:

- **Design (9):** `manfred-discovery`, `manfred-design-research`, `manfred-ux-strategy`, `manfred-design-systems`, `manfred-ui-design`, `manfred-interaction-design`, `manfred-prototyping-testing`, `manfred-design-ops`, `manfred-toolkit`
- **Engineering (1):** `manfred-dev`
- **Knowledge (1):** `manfred-knowledge`

Each `PluginCard` shows name, 1-line pitch (from source README), skill count, command count, and a `CommandBlock` with the `/plugin install …@manfred` line.

Content data lives in `src/content/plugins.ts` as a typed array. Updating the plugin list = editing one TS file. No API fetch — content ships at build time (lockstep with repo state).

## 7. Components

| Component | Behavior | DS usage |
|-----------|----------|----------|
| `CommandBlock` | Shell command with copy button; "Copied!" state reverts after 2s; `aria-live="polite"` announcement; keyboard-accessible | DS `Button` icon-only + mono font token + border token |
| `PathTabs` | New vs Existing toggle; preserves scroll; reflects selection in URL hash (`#new`/`#existing`); falls back to anchor links if JS disabled | DS `Tabs` (preferred) or `ToggleGroup` |
| `PluginCard` | Name, pitch, counts, install command | DS `Card` + `Badge` |
| `ThemeToggle` | Light / dark / system cycle; persists; honours `prefers-color-scheme` on first visit; honours `prefers-reduced-motion` | DS `IconButton` + color tokens |
| `AnchorNav` | Sticky top bar; highlights current section via `IntersectionObserver` | DS `Link` styling + container tokens |
| `SkipToContent` | Visually hidden link, visible on focus, jumps to `<main>` | DS link + sr-only utility |

Everything else is DS primitive composition (`Heading`, `Text`, `Stack`, `Container`, `List`, `Callout`). No new tokens, no bespoke buttons.

## 8. Accessibility

Non-negotiable (per repo CLAUDE.md):

- Semantic landmarks: `<header>`, `<main id="main">`, `<section aria-labelledby="…">`, `<nav aria-label>`, `<footer>`
- Skip-to-content link at the top
- All interactive elements keyboard-reachable; visible focus rings (DS)
- Copy buttons: `aria-live="polite"` region announces "Copied"
- Color contrast WCAG 2.2 AA in both themes
- `prefers-reduced-motion` disables animations
- Images (if any) have `alt` text; decorative images use `alt=""`
- Headings in order (one `<h1>` per page)

## 9. Testing

### 9.1 Unit (Vitest + Testing Library)

- `CommandBlock` — renders command, click copies to clipboard (mock), state reverts after 2s, `aria-live` region announces
- `PathTabs` — selection reflected in URL hash, keyboard arrow nav, selected state in DOM
- `ThemeToggle` — cycles light → dark → system → light; persists to `localStorage`; honours `prefers-color-scheme` on first mount
- `plugins.ts` — snapshot test to prevent accidental churn

### 9.2 E2E (Playwright)

One golden-path spec:

1. Load `/`
2. Verify hero + anchor nav visible
3. Click "Add to an existing repo" CTA → `#existing` in view
4. Switch `PathTabs` → URL hash changes
5. Copy an install command → clipboard matches
6. Navigate to `/plugins` → 11 plugin cards present
7. Copy one plugin install command → clipboard matches

### 9.3 Axe

`axe-playwright` runs on `/` and `/plugins` in both themes. Zero violations required.

### 9.4 Coverage

Start permissive (lines ≥ 70%), tighten after first ship.

## 10. CI

Add a `site` job to `.github/workflows/*.yml` (new file or existing CI workflow):

- Trigger: PRs touching `site/**` or `.github/workflows/site.yml`
- Steps: install (with `GITHUB_TOKEN` for DS package) → typecheck → lint → unit test → build → Playwright E2E → axe
- All jobs must pass before merge

Vercel's build injects its own token via project env; the GH Actions job uses the standard `${{ secrets.GITHUB_TOKEN }}`.

## 11. Documentation

- `site/README.md` — local dev, build, env vars, deploy target, how to update plugin list
- `site/CHANGELOG.md` — initial `0.1.0`
- Root `CHANGELOG.md` — "Added: onboarding site at `/site/`"
- Root `README.md` — top-of-file link: "New here? Start at [the onboarding site](<prod URL>)"
- `MEMORY.md` — session-close entry naming the site, its deploy URL, and where to update content

## 12. Non-goals (explicit)

- No analytics, no telemetry
- No search (Cmd+F suffices for a 1500-word page)
- No MDX / no CMS (TSX content is fine)
- No i18n (English only)
- No PWA, no offline, no service worker
- No auth (unlisted URL; add Vercel password or CF Access if it leaks)
- No agent-by-agent breakdown on the site (link to `docs/superpowers-workflow.md`)
- No DS component gallery (link to the DS repo)

## 13. Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| DS package install fails in Vercel build (missing `GITHUB_TOKEN`) | Document the exact `vercel env add` step in `site/README.md`; verify first deploy produces a non-empty env |
| Plugin list in `plugins.ts` drifts from `manfred-shared-knowledge` README | Snapshot test + `MEMORY.md` reminder; longer-term, generate `plugins.ts` from the upstream README (deferred — YAGNI now) |
| DS version bump breaks the site | Pin DS version in `package.json`; update deliberately with a PR |
| First-time colleague trips on `GITHUB_TOKEN` for the DS | Hero's Quick Start includes the one-line `export GITHUB_TOKEN=$(gh auth token)` prereq |
| URL leaks externally | Vercel password protection is one toggle away; add if we see traffic from unknown origins |

## 14. Open questions

- Should the site link to a Slack channel for help? If so, which one? (Default: `#manfred-eng`.) — ask Jens before shipping.
- Does the DS currently export a `Tabs` component, or do we need `ToggleGroup`? — resolved in the first implementation task by reading the DS package.

## 15. Success check (post-ship)

- One colleague does the full new-project path from the site without asking for help → success.
- Site stays at zero axe violations through 2 content updates → the pattern holds.
- `/plugins` is used often enough that it earns its route → otherwise fold back into home.
