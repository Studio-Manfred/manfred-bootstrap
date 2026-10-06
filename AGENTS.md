# AGENTS.md

Instructions for AI coding assistants (Claude Code, Cursor, Copilot) working in or with this repo.

## What this repo is

A GitHub template and bootstrap tool for Manfred projects. Two primary flows:

- **New project**: scaffolds a fresh Vite/React/TS project with Manfred's way-of-working.
- **Overlay**: drops the way-of-working onto an existing repo, non-destructively.

Public site: https://manfred-bootstrap-site.vercel.app

## When a user wants a new Manfred project

Trigger phrases: "start a new Manfred project", "new Manfred project", "scaffold a Manfred project", "bootstrap a new project with Manfred".

Verify prerequisites first:

- `git --version` (2.x or newer)
- `node --version` (20 or newer; 24+ preferred)
- `claude --version` (Claude Code CLI, used in the next step)
- Only if `--github` is requested: `gh auth status`

Ask for the project name (kebab-case), the prefix (3-4 uppercase letters, default `STU`), and whether to provision GitHub, Vercel and/or Linear. Then run:

```bash
curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh | bash -s -- new --name <name> --prefix <prefix> --dir ./<name> --yes
```

Optional flags, only with the user's explicit yes: `--github`, `--vercel`, `--linear --linear-team <prefix>`.

When it exits, `cd ./<name>`, tell the user to open the new directory in their editor, and point them at `docs/ways-of-working-overview.md`.

## When a user wants to overlay on an existing repo

Trigger phrases: "add manfred-bootstrap to this project", "overlay manfred", "add Manfred to this repo".

Confirm the user is at the repo root, then run:

```bash
curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh | bash -s -- overlay --dir . --prefix <prefix>
```

Overlay is non-destructive. Existing files are never overwritten.

## When a user just wants to download the template

Trigger phrases: "download the latest bootstrap", "get manfred-bootstrap", "clone the template".

Just clone, no stamping:

```bash
git clone --depth 1 https://github.com/Studio-Manfred/manfred-bootstrap.git <dir>
```

Then suggest they read `<dir>/docs/using-this-repo.md`.

## Working inside this repo

- Node 20+. Package manager: npm (see `starter/package-lock.json`).
- The onboarding site lives in `site/` and deploys to Vercel on push to main. Its CI workflow is `.github/workflows/site.yml` (path-gated to `site/**`).
- Commit messages: conventional commits (`feat(scope): ...`). Reference `STU-###` for Linear-linked work.
- Site checks: `npm --prefix site run test:run`, `typecheck`, `lint`, `build`.

## Hard rails

- NEVER run `--github`, `--vercel` or `--linear` without the user's explicit yes.
- NEVER use `git add -f`, `git add -A` or `git add .` after `cd site/`. Stage by explicit path.
- NEVER commit `node_modules/`, `dist/`, `coverage/`, `test-results/` or `playwright-report/`.
- Preserve files on overlay. The installer handles this; do not pass `--force` without permission.

## Related

- Public site: https://manfred-bootstrap-site.vercel.app
- Claude Code marketplace: https://github.com/Studio-Manfred/manfred-shared-knowledge
- Linear: STU-1035, STU-1037, STU-1038, STU-1039, STU-1040
