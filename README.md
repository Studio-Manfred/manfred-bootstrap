# my-process

Manfred's engineering way-of-working, plus a runnable scaffold every project starts from.

---

## What this is

A GitHub template repository that ships four things:

1. **Documented way-of-working (WoW)** — the decisions, conventions, and rituals that govern every Manfred project, living in `docs/`.
2. **Runnable Vite SPA starter** — a production-ready React + TypeScript app in `starter/` with the WoW already baked in: CI, Playwright E2E, axe accessibility checks, coverage ratchet, Linear-prefixed branches, and a private design-system reference.
3. **Dependency-free bootstrap** — `scripts/bootstrap.mjs` stamps a new project from the full starter, or overlays just the WoW files onto an existing repo. Optionally provisions a GitHub repository, a Vercel project, and a Linear team in a single command.
4. **Role-based agents** — eight named roles (strategist, analyst, designer, architect, builder, tester, documenter, release-manager), each backed by a specific Claude model via `.claude/agents/<role>.md`, shipped through the same overlay. Consumer projects check the design system first before building UI; the workflow is enforced by the `designer` role's system prompt.

---

## Get started — two ways

### a) GitHub "Use this template"

Click the green **Use this template** button at the top of this page, name your repo, and clone it. You get the full starter wired up immediately.

> **Note:** This repository must be marked as a **Template repository** in GitHub → Settings for the "Use this template" button to appear.

### b) Bootstrap script

Run locally — no install required:

```bash
# Stamp a brand-new project
node scripts/bootstrap.mjs new --name acme-app --prefix STU --dir ../acme-app

# Add the WoW files to an existing repo (non-destructive)
node scripts/bootstrap.mjs overlay --dir ../existing-repo --prefix STU

# Full provisioning in one shot: GitHub repo + Vercel project + Linear team
node scripts/bootstrap.mjs new --name acme-app --prefix STU --dir ../acme-app --github --vercel --linear --linear-team STU --yes
```

---

## `new` vs `overlay`

| | `new` | `overlay` |
|---|---|---|
| **Use when** | Starting a project from scratch | Adding WoW to a repo that already exists |
| **What it copies** | Everything in `starter/` | Only the files listed in `overlay.manifest.json` |
| **Existing files** | N/A — target dir must not exist | Never overwritten; you resolve conflicts |
| **Provisioning flags** | `--github`, `--vercel`, `--linear` | Same flags available |

---

## One-time setup

The starter references the private `@studio-manfred` design system via GitHub Packages. You need a GitHub token with `read:packages` scope to install it.

```bash
export GITHUB_TOKEN=$(gh auth token)   # works if gh is authenticated
# or set a classic PAT with read:packages in your shell profile
```

The `.npmrc` in `starter/` is already wired to read `GITHUB_TOKEN` from the environment — no extra configuration needed.

---

## Repo map

| Path | Purpose |
|---|---|
| `docs/` | The way-of-working and knowledge base — **read this first** |
| `starter/` | Canonical project files that `bootstrap new` copies |
| `scripts/bootstrap.mjs` | The bootstrap tool |
| `overlay.manifest.json` | Declares which files form the portable WoW overlay |

---

## Onboarding path for new Manfred devs

1. This README — orientation
2. [docs/using-this-repo.md](docs/using-this-repo.md) — how the repo is structured and how to use it day-to-day
3. [docs/ways-of-working-overview.md](docs/ways-of-working-overview.md) — the principles behind every decision
4. Deep-dive docs as needed: [ways-of-working.md](docs/ways-of-working.md), [stack-and-conventions.md](docs/stack-and-conventions.md), [superpowers-workflow.md](docs/superpowers-workflow.md)
