# MEMORY — my-process

Session log for the `my-process` template repo itself (meta — the starter ships its
own `starter/MEMORY.md` template). Newest first.

## 2026-09-29 — STU-977 DS-first convention shipped

- **Shipped (branch `feat/STU-977-ds-first-convention`):** designer role
  checks DS first via a 4-part workflow-step embedded in its system
  prompt (spec §6.1); release-manager picks up done stubs via a grep on
  every `@studio-manfred/*` update (spec §6.4). knowledge/roles.md and
  AGENTS.md updated to match; four workflow docs propagated. Content-lint
  tests guard the load-bearing markers ("Check the design system first",
  `_ds-stubs/`, `TODO(STU-`, `npm update.*@studio-manfred`). Suite
  27 → 29.
- **Decisions:** stub-and-continue is the default (block only when DS
  behavior is on the critical path); stub dir is `src/components/_ds-stubs/`
  verbatim; Linear inbox is Studio Manfred team, "Design System" project
  (P-STU-1). Ledger ruling: added prose "TODO(STU-NNN)" alongside the
  shell-escaped grep pattern so the test matches the literal form and
  the file reads naturally.
- **Next pickup:** STU-978 (blocked-by-this-one; DS repo installs role
  system via overlay + adds `ds-designer` role file). Then rollout
  tickets for existing consumer repos (whiteboard already has the role
  files; needs an overlay pass to pick up updated designer.md +
  release-manager.md).

## 2026-09-24 — STU-917 role-based agents shipped

- **Shipped (branch `feat/STU-917-role-based-agents`):** eight named roles
  (strategist, analyst, designer, architect, builder, tester, documenter,
  release-manager) bound to Claude models via `.claude/agents/*.md`
  frontmatter (Fable / Opus / Sonnet / Haiku). Convention at
  `starter/knowledge/roles.md`, router in `starter/AGENTS.md`. Overlay
  manifest 16 → 25 files. Top-level `.claude/agents/` byte-identical to
  the starter copy (test-enforced). Bootstrap test suite 19 → 26 assertions.
- **Decisions:** enforcement is Option C (harness-enforced `.claude/agents/*.md`
  + human-readable `knowledge/roles.md`); `tools:` frontmatter omitted for
  now (open access, follow-up ticket to lock down); Analyst on Fable
  (narrative specs) not Sonnet; per-heading `**Role:** ...` tags in
  `docs/superpowers-workflow.md` deferred — the Roles table at the top
  of that file already maps every step.
- **Next pickup:** open PR with `Closes STU-917`; watch CI; run
  `/finishing-a-development-branch` on merge. Then file follow-up tickets:
  (1) lock down `tools:` per role; (2) harness-level test that verifies
  the 4 model IDs are still accepted; (3) evaluate single-source-of-truth
  refactor for the two agent-file copies.

## 2026-07-14 — STU-645 + STU-652 learnings folded in · committed, not pushed

- **Shipped (branch `docs/stu-645-652-bootstrap-learnings`, off
  `docs/mcp-published-fallback`):** DS-access checklist (CI Manage-Actions-access
  grant + Vercel `GITHUB_TOKEN`) in `bootstrap.mjs` next-steps,
  `stack-and-conventions.md`, and `knowledge/gotchas.md` (existing 401 entry
  expanded to three surfaces — anchor updated in `domain.md`). Starter gains:
  changelog-merge discipline + throwaway-Playwright visual-verification pattern in
  `AGENTS.md`, seeded TanStack Query v5 / PGlite gotchas in `knowledge/ERRORS.md`,
  and new `knowledge/ui-patterns.md` (added to `overlay.manifest.json`, now 16
  files). 19/19 bootstrap tests green.
- **Decision:** TanStack/PGlite gotchas seeded in the *starter*, not
  `docs/knowledge/gotchas.md` — the cross-repo base requires ≥2 repos; these have
  one sighting (workshops).
- **Next pickup:** push branch + open PR with `Closes STU-645` / `Closes STU-652`
  (base branch `docs/mcp-published-fallback` is itself unmerged — merge that first
  or PR the stack). DS `IconName` gaps (`lock`, `grip-vertical`, `copy`, `trash`)
  still need a ticket in `manfred-design-system`.

## 2026-06-06 — Initial build · shipped

- **Shipped:** Full template built and pushed to
  <https://github.com/Studio-Manfred/my-process> (private, org-owned, marked as a
  **template repository**). Built directly on `main`.
  - `docs/` — `ways-of-working.md` (16 sections), `ways-of-working-overview.md`
    (mirrors the deck spine), `superpowers-workflow.md`, `stack-and-conventions.md`,
    `using-this-repo.md`; `docs/knowledge/` compounded base (INDEX, gotchas ×10 incl.
    cross-repo evidence, domain, procedural); spec + plan under `docs/superpowers/`;
    `docs/HANDOFF.md`.
  - `starter/` — runnable Vite SPA (React 19 + TS + Vite + Tailwind v4 + shadcn
    `components.json` + `@studio-manfred/manfred-design-system`) with the WoW baked in
    (AGENTS/CLAUDE/MEMORY/knowledge, CI verify+e2e, PR template, eslint jsx-a11y,
    vitest, playwright + axe, coverage ratchet, vercel.json, .npmrc, .gitignore). All
    gates green (lint/typecheck/unit/coverage/build/e2e).
  - `overlay.manifest.json` (15 files) + `scripts/bootstrap.mjs` (`new`|`overlay`,
    placeholder swap, skip-by-default collision policy, optional GitHub/Vercel/Linear
    provisioning) with 19 passing `node:test` cases.
  - `presentations/` — existing reveal.js deck draft, carried over.
- **Decisions:** built on `main` (no worktree, per request); starter is frontend-only
  Vite SPA; overlay is manifest-driven over `starter/` (single source of truth);
  `package.json` is written in `new` mode but protected in `overlay` mode; the design
  system installs via `GITHUB_TOKEN=$(gh auth token)` (needs `read:packages`).
- **Next pickup:** update the reveal.js deck in `presentations/` from the new
  generalized docs (the spine is already mirrored in `ways-of-working-overview.md`).
  See `docs/HANDOFF.md` for any remaining manual GitHub steps. Consider wiring
  Dependabot/Renovate for the starter deps.
