# DS-First Convention (STU-977) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bake the "check the design system first" workflow into the `designer` and `release-manager` role files (and their knowledge/roles.md mirrors + one AGENTS.md callout), so every stamped/overlaid consumer project inherits it via `manfred-bootstrap`.

**Architecture:** Pure content changes in the existing STU-917 role files + two new content-lint tests. No new files, no `overlay.manifest.json` change, no `bootstrap.mjs` logic change. Top-level `.claude/agents/*.md` copies stay byte-identical to starter (existing test enforces).

**Tech Stack:** Node.js ≥ v18, `node:test`, `node:assert/strict`. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-29-ds-handoff-design.md`

## Global Constraints

- **No new files.** Only edits.
- **No changes to `bootstrap.mjs` logic or `overlay.manifest.json`.**
- **Top-level dogfood copies at `.claude/agents/*.md` must stay byte-identical to `starter/.claude/agents/*.md`.** Existing test from STU-917 enforces this.
- **Suite grows from 27 → 29** (2 content-lint assertions).
- **Stub-directory naming:** `src/components/_ds-stubs/` (verbatim, exactly one instance).
- **Marker string in stubs:** `TODO(STU-NNN)` where `NNN` is any digit sequence.
- **Linear target for tickets:** Studio Manfred team, "Design System" project (P-STU-1).
- **CHANGELOG discipline:** merge new entries under the existing `[Unreleased] → Added` heading; never prepend a new heading block.
- **Commit convention:** `<type>(<scope>): summary (STU-977)`; PR body ends with `Closes STU-977`.

## Review Focus

Five input classes the spec implies but no task's tests exercise directly. Each has an inline test attached; the fifth is a discipline note where an automated test is inappropriate.

1. **Content-lint marker phrasing that rewording would break.** If the test greps for a common phrase, a future prose polish could pass while the semantic content vanishes. Pick a load-bearing marker: `Check the design system first` for designer.md (the numbered step heading from spec §6.1); `TODO(STU-` for release-manager.md (the actual grep pattern from spec §6.4). → Tests in Task 1 and Task 2.
2. **Case mismatch between `_ds-stubs/` (directory) and stub filename (`PascalCase.tsx`).** The convention is dir=lowercase-underscored, filenames=PascalCase. Test must match `_ds-stubs/` verbatim (with the leading underscore and trailing slash) so a future edit to `ds-stubs/` (no underscore) fails. → Test in Task 1.
3. **Byte-identical drift between starter and top-level after a one-side update.** If a task updates `starter/.claude/agents/designer.md` but forgets `.claude/agents/designer.md`, STU-917's existing byte-identical test catches it. → No new test; the existing test IS the guard. Task 1 and Task 2 each end with a `cp` step and a full-suite run to confirm.
4. **CHANGELOG heading prepend regression.** The Manfred rhythm warns against prepending a new `[Unreleased]` heading block. Task 5's implementer must find and extend the existing block. → Not testable cheaply; called out as a step-level discipline check.
5. **Test coverage of stubs the release-manager `grep` pattern would match in an unexpected file (e.g., a commented-out `TODO(STU-1234)` in a test file).** False positives at pickup time are only a mild annoyance (nothing to swap → skip). Not worth a test. → Documented in the release-manager prompt as "check the ticket status" — a stub with a nonexistent or Not-Done ticket is a no-op.

---

## File Structure

**Modified (11 files):**

- `starter/.claude/agents/designer.md` — Job section: prepend 4-part DS-first step + embed ticket template (content from spec §6.1 and §6.2)
- `starter/.claude/agents/release-manager.md` — Job section: append stub-pickup step (content from spec §6.4)
- `starter/knowledge/roles.md` — Designer and Release Manager sections mirror the new content (terse pointers, not full duplication)
- `starter/AGENTS.md` — new "Design System first" callout right after the Roles section, above per-PR rhythm
- `.claude/agents/designer.md` — byte-identical `cp` from starter after Task 1
- `.claude/agents/release-manager.md` — byte-identical `cp` from starter after Task 2
- `scripts/bootstrap.test.mjs` — 2 new tests (content-lint for designer.md, content-lint for release-manager.md)
- `docs/superpowers-workflow.md` — one-line mention in the designer + release-manager rows of the Roles section
- `docs/ways-of-working.md` — extend §16 "The eight roles" with a paragraph on the DS-first convention
- `docs/ways-of-working-overview.md` — extend the Roles row of the Tooling table
- `README.md` — extend the "Role-based agents" bullet with a mention of DS-first
- `CHANGELOG.md` — entry under `[Unreleased] → Added`
- `MEMORY.md` — dated close entry (last commit)

Some of those bullets group multiple docs into one commit (Task 4). No files created.

---

## Task 1: DS-first content in designer.md + test

**Files:**
- Modify: `starter/.claude/agents/designer.md`
- Modify: `starter/knowledge/roles.md` (Designer section)
- Modify: `.claude/agents/designer.md` (byte-identical `cp` from starter)
- Modify: `scripts/bootstrap.test.mjs` (add 1 test)

**Interfaces:**
- Consumes: `AGENT_ROLES` and `readFrontmatter` are already in bootstrap.test.mjs (from STU-917). No new imports needed.
- Produces: none.

- [ ] **Step 1: Add failing test to `scripts/bootstrap.test.mjs`**

Append after STU-917's existing tests:

```javascript
test('designer.md prompts the DS-first workflow-step', () => {
  const abs = new URL('../starter/.claude/agents/designer.md', import.meta.url)
  const body = readFileSync(abs, 'utf8')
  assert.match(body, /Check the design system first/,
    'designer.md missing the DS-first step-1 marker (spec §6.1)')
  assert.match(body, /_ds-stubs\//,
    'designer.md missing the stub-directory naming (spec §6.3)')
  assert.match(body, /Design System.*Linear project/,
    'designer.md missing the ticket-filing pointer (spec §6.2)')
})
```

- [ ] **Step 2: Run the test — verify RED**

Run: `node --test scripts/bootstrap.test.mjs 2>&1 | grep -E '^(✖|ℹ (tests|pass|fail))' | head -6`
Expected: `fail 1` — the new test fails on all three assertions because designer.md doesn't yet mention any of them.

- [ ] **Step 3: Update `starter/.claude/agents/designer.md`**

Prepend the 4-part DS-first step to the Job section, verbatim from spec §6.1. The embedded ticket template goes inline within step 3 of that content, verbatim from spec §6.2.

Anchor for the Edit: the current file starts its Job section with `## Job\n- Turn the approved spec into concrete UX:`. Replace with the prepended content followed by the existing bullets.

- [ ] **Step 4: Mirror in `starter/knowledge/roles.md` — Designer section**

The Designer section already exists (from STU-917). Extend its `### When to use` OR `### Purpose` block with a short pointer: `Before starting any UI: check `~/Sandbox/Code/manfred-design-system/` for coverage. If missing → file a "Design System" Linear project ticket and stub locally under `src/components/_ds-stubs/`. See `.claude/agents/designer.md` for the full workflow.`

- [ ] **Step 5: Copy to top-level**

Run: `cp starter/.claude/agents/designer.md .claude/agents/designer.md`

- [ ] **Step 6: Run the full suite — verify GREEN**

Run: `node --test scripts/bootstrap.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)' | head -3`
Expected: `tests 28`, `pass 28`, `fail 0`.

If the byte-identical test from STU-917 fails, the `cp` in Step 5 was skipped.

- [ ] **Step 7: Commit**

```bash
git add starter/.claude/agents/designer.md starter/knowledge/roles.md .claude/agents/designer.md scripts/bootstrap.test.mjs
git commit -m "$(cat <<'EOF'
feat(agents): designer role checks DS first (STU-977)

designer.md gains the 4-part DS-first step (check DS exports; use it if
present; file a Design System Linear ticket + stub under
src/components/_ds-stubs/ if not; reference the ticket in the stub).
knowledge/roles.md mirrors. Top-level dogfood copy stays byte-identical.
New content-lint test enforces the three load-bearing markers.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MftSCGfUN53YzYyV9uRkWR
EOF
)"
```

---

## Task 2: Stub-pickup content in release-manager.md + test

**Files:**
- Modify: `starter/.claude/agents/release-manager.md`
- Modify: `starter/knowledge/roles.md` (Release Manager section)
- Modify: `.claude/agents/release-manager.md` (byte-identical `cp` from starter)
- Modify: `scripts/bootstrap.test.mjs` (add 1 test)

**Interfaces:** None. Self-contained.

- [ ] **Step 1: Add failing test**

```javascript
test('release-manager.md prompts the DS-stub pickup step', () => {
  const abs = new URL('../starter/.claude/agents/release-manager.md', import.meta.url)
  const body = readFileSync(abs, 'utf8')
  assert.match(body, /TODO\(STU-/,
    'release-manager.md missing the TODO(STU-...) grep marker for stub pickup (spec §6.4)')
  assert.match(body, /npm update.*@studio-manfred/,
    'release-manager.md missing the npm-update trigger for the pickup step')
})
```

- [ ] **Step 2: Run test — verify RED**

Expected: `fail 1`.

- [ ] **Step 3: Update `starter/.claude/agents/release-manager.md`**

Append the stub-pickup step to the Job section, verbatim from spec §6.4. Anchor: end of the existing `## Job` list.

- [ ] **Step 4: Mirror in `starter/knowledge/roles.md` — Release Manager section**

Extend the Release Manager section with a short pointer to the stub-pickup step; do not duplicate the full content — reference `.claude/agents/release-manager.md`.

- [ ] **Step 5: Copy to top-level**

Run: `cp starter/.claude/agents/release-manager.md .claude/agents/release-manager.md`

- [ ] **Step 6: Run the full suite — verify GREEN**

Expected: `tests 29`, `pass 29`, `fail 0`.

- [ ] **Step 7: Commit**

```bash
git add starter/.claude/agents/release-manager.md starter/knowledge/roles.md .claude/agents/release-manager.md scripts/bootstrap.test.mjs
git commit -m "$(cat <<'EOF'
feat(agents): release-manager picks up done DS stubs (STU-977)

After every `npm update @studio-manfred/*`, the release-manager greps
for TODO(STU-NNN) markers in src/, checks each ticket's status, and
opens follow-up PRs to swap done stubs for real DS exports.
knowledge/roles.md mirrors. Top-level dogfood copy byte-identical.
Content-lint test guards the grep pattern and the npm-update trigger.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MftSCGfUN53YzYyV9uRkWR
EOF
)"
```

---

## Task 3: AGENTS.md "Design System first" callout

**Files:**
- Modify: `starter/AGENTS.md`

**Interfaces:** None.

No test — the router-token test from STU-917 already checks role names appear after `## Roles`; adding non-role prose in that slice doesn't break it. Content lives in the role files (tested in Task 1 + 2); the AGENTS.md callout is a signpost, not a load-bearing spec.

- [ ] **Step 1: Insert callout in `starter/AGENTS.md`**

Anchor: the end of the `See knowledge/roles.md for the full role definitions.` line (the existing closing line of the Roles section). Insert immediately after:

```markdown

### Design System first

**Before designing any new UI:** check `~/Sandbox/Code/manfred-design-system/` for coverage. If the DS lacks the component, file a ticket in the Studio Manfred team "Design System" Linear project and stub locally under `src/components/_ds-stubs/` with a `TODO(STU-NNN)` marker. See `knowledge/roles.md` (Designer section) for the full workflow, and `release-manager.md` for the stub-pickup step on `npm update`.
```

- [ ] **Step 2: Run the full suite — verify still GREEN**

Expected: 29/29 (unchanged from Task 2).

- [ ] **Step 3: Commit**

```bash
git add starter/AGENTS.md
git commit -m "docs(agents): add Design System first callout to AGENTS.md (STU-977)"
```

---

## Task 4: Doc updates

**Files:**
- Modify: `docs/superpowers-workflow.md`
- Modify: `docs/ways-of-working.md`
- Modify: `docs/ways-of-working-overview.md`
- Modify: `README.md`

**Interfaces:** None. All content-only.

- [ ] **Step 1: `docs/superpowers-workflow.md`**

Anchor: the existing Roles table (from STU-917). Below the table, add a single paragraph:

```markdown
The `designer` role's workflow includes a **design-system-first** step
(check the DS for coverage before building UI, file a Studio Manfred
"Design System" Linear ticket if absent). The `release-manager` role's
loop-close includes a **stub-pickup** step that grep-scans for
`TODO(STU-NNN)` markers on every `@studio-manfred/*` update. See the
starter's `knowledge/roles.md` for the full role definitions.
```

- [ ] **Step 2: `docs/ways-of-working.md` — extend §16 "The eight roles"**

Anchor: end of §16 (after the "See starter/knowledge/roles.md" line). Add a subsection:

```markdown
### Design system handoff

The `designer` role first checks `manfred-design-system` for coverage.
When the DS lacks a component, the designer files a ticket in the
Studio Manfred "Design System" project and stubs locally under
`src/components/_ds-stubs/<Name>.tsx` with a `TODO(STU-NNN)` marker.
The `ds-designer` role in the DS repo (Opus) picks up the ticket,
designs the API, writes failing tests, and hands off implementation to
`builder`. On the next `npm update @studio-manfred/*`, `release-manager`
greps for stub markers and opens follow-up PRs to swap done stubs.
Full design: `docs/superpowers/specs/2026-09-29-ds-handoff-design.md`.
```

- [ ] **Step 3: `docs/ways-of-working-overview.md` — extend Roles row**

Anchor: the Roles row in the Tooling table (from STU-917). Append to the row's cell:

`Consumer designer checks DS first; release-manager picks up done stubs. Full workflow in `starter/knowledge/roles.md`.`

- [ ] **Step 4: `README.md`**

Anchor: the "Role-based agents" bullet (item 4 in "What this is"). Append one sentence:

`Consumer projects check the design system first before building UI; the workflow is enforced by the designer role's system prompt.`

- [ ] **Step 5: Run the full suite — verify still GREEN**

Expected: 29/29.

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers-workflow.md docs/ways-of-working.md docs/ways-of-working-overview.md README.md
git commit -m "docs: propagate DS-first convention across workflow docs (STU-977)"
```

---

## Task 5: CHANGELOG + MEMORY close

**Files:**
- Modify: `CHANGELOG.md`
- Modify: `MEMORY.md`

**Interfaces:** None.

**CHANGELOG discipline reminder:** merge under the existing `[Unreleased] → Added` heading (which exists from STU-917's own entry). Never prepend a new `[Unreleased]` heading block.

- [ ] **Step 1: Add entry to `CHANGELOG.md`**

Anchor: the last existing bullet under `[Unreleased] → Added`. Append:

```markdown
- **DS-first convention (STU-977).** Consumer `designer` role now checks
  `manfred-design-system` for coverage before building UI, files a ticket
  in the Studio Manfred "Design System" Linear project when the DS lacks
  a component, and stubs locally under `src/components/_ds-stubs/` with a
  `TODO(STU-NNN)` marker. `release-manager` role now greps for those
  markers on `npm update @studio-manfred/*` and opens swap-PRs when the
  DS ticket closes. Companion ticket STU-978 adds the receiving
  `ds-designer` role in the DS repo.
```

- [ ] **Step 2: Prepend dated entry to `MEMORY.md`**

Anchor: top of `MEMORY.md`, above the existing 2026-09-24 STU-917 entry. Prepend:

```markdown
## 2026-09-29 — STU-977 DS-first convention shipped

- **Shipped (branch `feat/STU-977-ds-first-convention`):** designer role
  checks DS first via a 4-part workflow-step embedded in its system
  prompt (spec §6.1); release-manager picks up done stubs via a grep on
  every `@studio-manfred/*` update (spec §6.4). knowledge/roles.md and
  AGENTS.md updated to match; four docs propagated. Content-lint tests
  guard the load-bearing markers ("Check the design system first",
  `_ds-stubs/`, `TODO(STU-`, `npm update.*@studio-manfred`). Suite
  27 → 29.
- **Decisions:** stub-and-continue is the default (block only when DS
  behavior is on the critical path); stub dir is `src/components/_ds-stubs/`
  verbatim; Linear inbox is Studio Manfred team, "Design System" project.
- **Next pickup:** STU-978 (blocked-by-this-one; DS repo installs role
  system via overlay + adds ds-designer role file). Then rollout tickets
  for existing consumer repos (whiteboard already has the role files;
  needs an overlay pass to pick up updated designer.md + release-manager.md).
```

- [ ] **Step 3: Run the final suite**

Run: `node --test scripts/bootstrap.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail)' | head -3`
Expected: `tests 29`, `pass 29`, `fail 0`.

- [ ] **Step 4: Commit**

```bash
git add CHANGELOG.md MEMORY.md
git commit -m "$(cat <<'EOF'
chore(release): CHANGELOG + MEMORY for DS-first convention (STU-977)

CHANGELOG entry merged under existing [Unreleased] → Added heading
(no new heading block). MEMORY dated entry with what shipped, the
locked-in decisions, and the pickup pointer to STU-978.

Closes STU-977

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01MftSCGfUN53YzYyV9uRkWR
EOF
)"
```

---

## Post-implementation checklist

Before opening the PR:

- [ ] `node --test scripts/bootstrap.test.mjs` — 29/29 pass.
- [ ] `git log --oneline main..HEAD` — 5 task commits + 1 spec commit = 6 commits.
- [ ] `starter/.claude/agents/designer.md` contains "Check the design system first" and `_ds-stubs/`.
- [ ] `starter/.claude/agents/release-manager.md` contains `TODO(STU-` and `npm update`.
- [ ] `.claude/agents/{designer,release-manager}.md` byte-identical to starter (existing test verifies).
- [ ] `starter/AGENTS.md` has a `### Design System first` subheading.
- [ ] All 4 docs updated per Task 4.
- [ ] CHANGELOG entry merged under existing `[Unreleased] → Added` heading (not prepended as new).
- [ ] MEMORY has the dated 2026-09-29 entry.
- [ ] PR body ends with `Closes STU-977`.

## Follow-ups (out of scope; file after merge or wait for STU-978 completion)

1. **STU-978** — DS repo install + ds-designer role. Blocked by STU-977 (this plan).
2. **Rollout tickets** for each existing consumer repo (intranet, whiteboard, web, ...) — one per repo, following the STU-924 pattern.
3. **Optional:** a script that greps `TODO(STU-NNN)` markers, queries Linear for each ticket's status, and prints a ready-to-swap report (mentioned in spec §9 as a nice-to-have).
