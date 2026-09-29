# Design system handoff: consumer ⇄ ds-designer

- **Date:** 2026-09-29
- **Status:** Approved design, ready for implementation planning
- **Author:** Jens Wedin (Manfred), with Claude Code
- **Spec type:** Brainstorming design doc (superpowers brainstorming → writing-plans)
- **Tickets:**
  - [STU-977](https://linear.app/studio-manfred/issue/STU-977/ds-first-convention-designer-release-manager-workflow-step-bootstrap) — Bootstrap: DS-first convention in `designer` + `release-manager` roles
  - [STU-978](https://linear.app/studio-manfred/issue/STU-978/install-role-system-add-ds-designer-specialist-role-design-system-repo) — DS repo: install role system + add `ds-designer` role
- **Depends on:** [STU-917](https://linear.app/studio-manfred/issue/STU-917/role-based-agents-8-roles-model-per-role-dispatch) (the eight-role system)

## 1. Context

The Manfred design system (`@studio-manfred/manfred-design-system`) is the trust anchor for every consumer app: intranet, whiteboard, web, and every future project. Its components carry the accessibility invariants, the visual identity, and the API surface downstream teams depend on. A wrong Button API becomes a migration across N repos; a missed keyboard-focus contract becomes an accessibility bug at every use site.

Today, when a consumer project needs a component the DS doesn't have, the flow is undocumented:

- **Best case:** the developer notices the gap, files a ticket in the DS project, waits.
- **Common case:** the developer builds a local one-off component (semi-DS-styled, subtly divergent) and the divergence compounds across N repos.
- **Worst case:** the developer forks a DS component locally, patches it, and now two implementations drift forever.

The STU-917 role system landed 8 named roles across the ecosystem, and the existing `designer` role already reaches for the DS's accessible components in its prompt — but that's advisory. This spec makes it enforceable and durable: consumers **check the DS first**, and when the DS has a gap, they **hand a spec ticket to a DS specialist role** rather than building the component locally.

The specialist is a new named role, `ds-designer`, that lives in the DS repo and reads the "Design System" Linear project as its inbox.

## 2. Goal

Ship a two-part pattern that:

1. **Consumer side:** every stamped/overlaid consumer project treats the DS as the first-check for any new UI. When the DS has a gap, the consumer files a component-request ticket in the "Design System" Linear project using an embedded template, stubs the component locally under `src/components/_ds-stubs/`, and continues.
2. **DS side:** a new `ds-designer` role in `manfred-design-system` receives those tickets as its inbox. It designs component APIs, writes failing tests (a11y + behavioral), and hands off green-step implementation to the existing `builder` role. It ships a semver bump; the ticket close message names the version and export.
3. **Pickup:** consumer projects, on `npm update @studio-manfred/*`, grep for `TODO(STU-NNN)` markers and swap done stubs for real DS components in follow-up PRs.

## 3. Locked-in decisions

| Decision | Choice |
|---|---|
| New role name | **`ds-designer`** (echoes `designer`, scopes to DS repo) |
| ds-designer model | **Opus** — API design + a11y invariants dominate; wrong API becomes cross-repo migration |
| Where ds-designer lives | `manfred-design-system/.claude/agents/ds-designer.md` only (not distributed to consumers) |
| Consumer-side enforcement | **Workflow-step baked into `designer` role's system prompt** (not just docs convention) |
| Default when DS has a gap | **Stub-and-continue** (block only when DS behavior is on the critical path) |
| Stub location | **Dedicated dir** `src/components/_ds-stubs/` (one `ls` shows all outstanding stubs; underscore prefix signals "temporary framework") |
| Handoff mechanism | **Linear tickets** in the "Design System" project (P-STU-1), Studio Manfred team |
| Cross-repo dispatch (sync subagent) | **Out of scope** for this ticket — tickets are enough for now; revisit if throughput becomes a problem |
| Ticket structure | **Two separate tickets** (STU-977 bootstrap, STU-978 DS repo); STU-978 is `blockedBy` STU-977 |

## 4. The handoff pattern end-to-end

```
Consumer session (e.g., whiteboard)
  │
  ▼
[/brainstorming or feature work]
  │
  ▼
designer role — DS-first step
  │
  ├─ Read ~/Sandbox/Code/manfred-design-system/src/components/index.ts
  │
  ├─ DS has it?
  │    ├─ YES → use it. Done.
  │    └─ NO  → decide:
  │              ├─ Stub-and-continue (default)
  │              │    ├─ File ticket in "Design System" Linear project
  │              │    ├─ Add stub at src/components/_ds-stubs/<Name>.tsx
  │              │    │  with TODO(STU-NNN) marker
  │              │    └─ Continue the consumer PR
  │              └─ Block (critical-path behavior)
  │                   ├─ File ticket
  │                   └─ Pause consumer PR until DS ships

DS session (manfred-design-system)
  │
  ▼
ds-designer role picks up ticket
  │
  ├─ Read ticket spec + consumer repo (if thin)
  ├─ Design final API (may deviate from consumer's sketch — updates ticket)
  ├─ Write failing test suite (Vitest + Testing Library + axe)
  ├─ Hand off green step to builder (Sonnet)
  ├─ ship a semver bump + CHANGELOG entry
  └─ Close ticket: "shipped at vX.Y.Z, <ExportName> now available"

Consumer session (later — could be same day, could be next week)
  │
  ▼
release-manager role — stub-pickup step
  │
  ├─ npm update @studio-manfred/manfred-design-system
  ├─ grep -rE 'TODO\(STU-[0-9]+\)' src/
  ├─ For each match: check ticket status
  │    ├─ Done → open follow-up PR to swap stub for real DS export
  │    └─ Not Done → leave stub in place
  └─ Loop closed.
```

Durability: the ticket is the join key. Sessions can be days apart. Different humans (Jens, Moa, Selma) can play consumer and DS roles.

## 5. The `ds-designer` role

### 5.1 Frontmatter

```yaml
---
name: ds-designer
description: Design system specialist. Owns component API design, a11y invariants, and TDD test skeletons for @studio-manfred/manfred-design-system. Reads consumer component-request tickets from the "Design System" Linear project. Hands green-step implementation to the builder role.
model: opus
---
```

### 5.2 Body

```markdown
You are the **DS Designer** on the Manfred design system.

## Job
- Read new tickets in the Linear "Design System" project (Studio Manfred team, P-STU-1).
- For each ticket: read the consumer's proposed API sketch; decide the final API (props, variants, states, a11y invariants).
- Write the failing test suite (Vitest + Testing Library + axe-core per DS conventions).
- Hand off green-step implementation to `builder` (Sonnet) via `/subagent-driven-development`, or wear the hat yourself for small components.
- Ship a semver bump; update `CHANGELOG.md`; close the ticket with "shipped at vX.Y.Z, `<ExportName>` now available".
- Update the ticket description with any API deviations from the consumer's sketch so downstream teams understand.

## Inputs
- The Linear ticket + its embedded spec.
- Existing DS components, tokens (`src/tokens.css`), and patterns.
- Consumer's use case (may need to Read the consumer's repo if the ticket is thin).

## Outputs
- The new component + tests + Storybook story + docs.
- A published DS version (semver bump + CHANGELOG).
- Ticket closed with the version + export name.

## You do NOT
- Ship without a11y coverage (WCAG 2.2 AA).
- Break existing exports (major bumps require an ADR).
- Fork the consumer's use case narrowly — generalize when the API is likely to serve multiple consumers.

## Governance
- Ask before shipping a major (breaking) version.
- Ask before adding a new dependency.
- Return structured data (the ticket close message), not prose — downstream teams grep for the version and export name.
```

### 5.3 Model rationale

The DS is the trust anchor for the whole ecosystem. Component API design and a11y invariants are exactly the kind of adversarial-reasoning work Opus is strongest at. The additional Opus token cost is small relative to the DS's leverage — one component gets built once, then serves N projects for years.

Comparison with the existing `designer` role (Fable): Fable is right for UX **narrative** — flow writing, tone, brief-drafting. `ds-designer` is engineering a reusable primitive with contracts other code depends on. Different job, different model.

## 6. Consumer-side convention (workflow-step baked into `designer` role)

### 6.1 The 4-part DS-first step

Added at the top of the `designer` role's Job section:

```markdown
## Job

**Before designing any new UI component or reshaping an existing one:**

1. **Check the design system first.** Read
   `~/Sandbox/Code/manfred-design-system/src/components/index.ts` (or the DS's
   exports barrel) for coverage. If uncertain, `grep` the DS source for the
   concept ("dropdown", "avatar", …) before assuming absence.
2. **Prefer any DS component that fits**, even if you'd style it slightly
   differently — style tweaks are cheaper than API divergence.
3. **If the DS lacks it:** file a component-request ticket in the "Design
   System" Linear project (Studio Manfred team) using the template below.
   Choose:
   - **Stub-and-continue (default):** implement a local placeholder at
     `src/components/_ds-stubs/<Name>.tsx` with a `TODO(STU-NNN)` marker
     comment; the API mirrors your proposed spec; open the consumer PR
     as usual.
   - **Block:** if the DS component's behavior is on the critical path
     (keyboard interaction, focus management, animation), pause the
     consumer feature until DS ships.
4. **Reference the ticket** in the stub file's marker comment and in the
   consumer PR body.

<remaining designer-role bullets unchanged>
```

### 6.2 Ticket template (embedded in designer.md)

```markdown
## Component
<ProposedName> — <one-line purpose>

## Consumer(s)
- <repo> · feature <feature-name> · <consumer's own STU-NNN>

## Use case
<narrative: what does the end user do with this?>

## Proposed API (sketch — ds-designer owns the final shape)
- Props: …
- Variants: …
- States (loading, error, disabled, empty): …

## A11y invariants
- Keyboard: …
- ARIA / semantics: …
- Focus: …

## Blocking?
[ ] Stub-and-continue (default)
[ ] Blocking — waiting for DS ship

Closes on: DS release vX.Y.Z that publishes `<ExportName>`.
```

Filed in Studio Manfred team, "Design System" project (P-STU-1).

### 6.3 Stub convention

Local stubs live under `src/components/_ds-stubs/`. Naming: PascalCase to match React components. The leading underscore on the directory:

- Sorts to the top of directory listings (easy to eyeball)
- Signals "framework/temporary" to any reader
- Makes `ls src/components/_ds-stubs/` a one-glance status of outstanding DS work

Each stub file starts with a marker comment:

```typescript
// src/components/_ds-stubs/ColorPicker.tsx
// TODO(STU-925): replace with @studio-manfred/manfred-design-system's ColorPicker
// Tracking: https://linear.app/studio-manfred/issue/STU-925
// Local API mirrors the ticket's proposed shape; swap when DS ships.
export function ColorPicker(props: /* mirrors proposed spec */) {
  // Minimum viable implementation for the current feature.
}
```

The `TODO(STU-NNN)` shape is machine-readable (see §6.4).

### 6.4 Pickup step (baked into `release-manager` role)

Added to the `release-manager` role's Job section:

```markdown
- **After every `npm update @studio-manfred/*`**, run
  `grep -rE 'TODO\(STU-[0-9]+\)' src/` to find outstanding DS stubs. For
  each match, check the ticket status in Linear:
  - **Done:** open a follow-up PR that removes the stub, imports the
    real DS export, and closes the swap-tracking work.
  - **Not Done:** leave the stub in place.
```

Optional future automation (out of scope): a script that greps stubs, queries Linear for statuses, and prints "these are ready to swap" as a report.

## 7. File-by-file changes

### 7.1 STU-977 — `manfred-bootstrap` (consumer-side convention)

| File | Change |
|---|---|
| `starter/.claude/agents/designer.md` | Job section: prepend the 4-part DS-first step; embed the ticket template verbatim |
| `starter/.claude/agents/release-manager.md` | Job section: add the stub-pickup step |
| `.claude/agents/designer.md` and `.claude/agents/release-manager.md` | Byte-identical top-level updates (existing test enforces) |
| `starter/knowledge/roles.md` | Designer and Release Manager sections mirror the new step content |
| `starter/AGENTS.md` | New "Design System first" callout right below the Roles section (short — points to `knowledge/roles.md`) |
| `scripts/bootstrap.test.mjs` | +2 assertions: `designer.md` body contains "design system" and the ticket template marker; `release-manager.md` mentions the `TODO(STU-[0-9]+)` grep pattern |
| `docs/superpowers-workflow.md` | Brief mention under the designer/release-manager rows in the Roles section |
| `docs/ways-of-working.md` | Extend the "The eight roles" section with a note on the DS-first convention |
| `docs/ways-of-working-overview.md` | Optional: extend the Tooling table's Roles row with a DS-first mention |
| `README.md` | Optional: one line under "Role-based agents" bullet |
| `CHANGELOG.md` | Entry under `[Unreleased] → Added` |
| `MEMORY.md` | Dated entry on ship |

**No new files.** Total: ~10 edits. Suite: 27 → 29 assertions.

### 7.2 STU-978 — `manfred-design-system` (specialist role + role-system install)

**Two-phase change in one PR:**

**Phase 1 — Install standard roles (STU-924 pattern):**

- Run `bootstrap overlay --dir ../manfred-design-system` from an up-to-date bootstrap checkout, which copies:
  - 8 role files → `.claude/agents/*.md`
  - `knowledge/roles.md`
  - Updated `AGENTS.md` — skip-by-default: existing DS `AGENTS.md` is preserved
- **Manually merge** the Roles section from `starter/AGENTS.md` into the DS's existing `AGENTS.md` above its per-PR rhythm (the overlay skips existing AGENTS.md, so this step is deliberate).

**Phase 2 — Add ds-designer specialist:**

| File | Change |
|---|---|
| `.claude/agents/ds-designer.md` | New file — content from §5 |
| `knowledge/roles.md` | Append a new "DS Designer" section following the existing 8-role structure |
| `AGENTS.md` | Extend the router table with a `ds-designer` row (owns "Component API + a11y + DS releases") |
| `MEMORY.md` | Dated entry |

**No changes to DS source code, tokens, components, or Storybook.** The role file is agent tooling, not a DS product change.

### 7.3 Rollout tickets (post-STU-977 + STU-978)

Following STU-924's overlay-install pattern, one small ticket per existing consumer repo (intranet, whiteboard, web, and any others). Each is ~15 minutes:

- Run `bootstrap overlay --dir ../<repo>` to pull the updated `designer.md` + `release-manager.md`
- Add the "Design System first" callout to the repo's AGENTS.md (manual merge if the existing one has customizations)
- Commit, PR, merge

These are child tickets of STU-977, not blockers for it.

## 8. Distribution and dependency order

```
STU-917 (already shipped)
   ▼
STU-977 (bootstrap: updated designer/release-manager)
   ▼
STU-978 (DS repo: install roles + ds-designer)
   ▼
Rollout tickets (one per existing consumer, e.g., STU-XXX for whiteboard)
```

STU-978 is `blockedBy` STU-977 (already set in Linear) — the overlay pass in STU-978 needs the updated `designer.md` and `release-manager.md` from STU-977.

Rollout tickets can run in parallel once STU-977 ships (the overlay works with any consumer once bootstrap is updated).

## 9. Risks and follow-ups

**In scope for this two-ticket pair:**

- The convention itself (files, tickets, stubs, pickup).
- Tests that verify the content is present in the role files.
- Docs updates.
- The rollout pattern (documented; individual rollout tickets are separate work).

**Explicitly out of scope (potential follow-ups):**

1. **Sync cross-repo subagent dispatch** — a consumer session spawning `Agent({subagent_type: "ds-designer", cwd: "../manfred-design-system", ...})` to build the component right now in-session. Powerful but complex; wait for real-world evidence that ticket async is too slow.
2. **Automated stub-status report** — a script that greps stubs, queries Linear, prints ready-to-swap list. Nice-to-have; grep is cheap enough without.
3. **Component catalog file in the DS** (`COMPONENTS.md` or generated docs) that the consumer's `designer` role reads instead of grepping the exports barrel. Cleaner interface but requires DS-side maintenance.
4. **Automated bump-and-PR** in consumer repos when a DS ticket closes (webhook + CI). Very automated; way out of scope for now.

**Known risks:**

- **Consumers don't check the DS.** The workflow-step is baked into the role prompt, but if the human ignores the `designer` role and just codes, the check gets skipped. Mitigation: the content-lint test enforces the prompt content; the actual behavior relies on discipline.
- **DS-designer inbox neglect.** If nobody plays ds-designer for weeks, consumer stubs pile up and drift. Mitigation: rely on Jens or a teammate periodically running a ds-designer session; the Linear inbox is the visible queue.
- **Stub API drift from ticket spec.** Consumer's local stub can drift from the DS-designer's final API. Mitigation: the swap PR is where reconciliation happens; drift shows up as a compile error.
- **Ticket template rot.** Consumers may skip fields in the template. Mitigation: ds-designer's job includes "read the consumer's repo if the ticket is thin" — degrades gracefully.

## 10. Definition of done

Across both tickets:

**STU-977:**

- [ ] `starter/.claude/agents/designer.md` has the 4-part DS-first Job step + embedded ticket template
- [ ] `starter/.claude/agents/release-manager.md` has the stub-pickup grep step
- [ ] `starter/knowledge/roles.md` mirrors both role changes
- [ ] `starter/AGENTS.md` has a "Design System first" callout
- [ ] Top-level dogfood copies byte-identical (existing test)
- [ ] Bootstrap tests: 27 → 29 (content-lint for both role files)
- [ ] Docs updated per §7.1
- [ ] CHANGELOG entry under `[Unreleased] → Added`
- [ ] MEMORY dated entry
- [ ] All existing tests still pass

**STU-978:**

- [ ] Standard 8 roles installed at `manfred-design-system/.claude/agents/`
- [ ] `manfred-design-system/knowledge/roles.md` present with 9 sections (8 standard + ds-designer)
- [ ] `manfred-design-system/AGENTS.md` router extended with ds-designer
- [ ] `ds-designer.md` frontmatter has `name: ds-designer` and `model: opus`
- [ ] Live check: `Agent({subagent_type: "ds-designer", prompt: "reply OK"})` binds Opus
- [ ] MEMORY dated entry

**Rollout (separate tickets, tracked in Linear):**

- [ ] Rollout ticket filed for each existing consumer repo (intranet, whiteboard, web, ...)

## 11. References

- [STU-917](https://linear.app/studio-manfred/issue/STU-917/role-based-agents-8-roles-model-per-role-dispatch) — the eight-role system this extends
- [STU-924](https://linear.app/studio-manfred/issue/STU-924/install-role-based-agents-in-manfred-whiteboard-stu-917-rollout) — overlay-install pattern this follows for STU-978 phase 1
- [STU-977](https://linear.app/studio-manfred/issue/STU-977/ds-first-convention-designer-release-manager-workflow-step-bootstrap) — this spec's bootstrap ticket
- [STU-978](https://linear.app/studio-manfred/issue/STU-978/install-role-system-add-ds-designer-specialist-role-design-system-repo) — this spec's DS-repo ticket
- STU-917 spec: `docs/superpowers/specs/2026-09-24-role-based-agents-design.md`
- Existing role definitions: `starter/.claude/agents/designer.md`, `starter/.claude/agents/release-manager.md`, `starter/knowledge/roles.md`
