# Role-based agents: eight roles, model-per-role dispatch

- **Date:** 2026-09-24
- **Status:** Approved design, ready for implementation planning
- **Author:** Jens Wedin (Manfred), with Claude Code
- **Spec type:** Brainstorming design doc (superpowers brainstorming → writing-plans)
- **Ticket:** [STU-917](https://linear.app/studio-manfred/issue/STU-917/role-based-agents-8-roles-model-per-role-dispatch)

## 1. Context

Every agent in the Manfred workflow currently runs on whichever Claude model the
session was launched with. That's the wrong shape for the work: rigor tasks and
volume tasks and voice tasks share nothing in cost, latency, or capability
profile, yet today they all pay the same rate on the same model.

Concretely:

- A **tester** grinding edge cases benefits from Opus-grade adversarial reasoning
  — a missed bug is far more expensive than the token difference.
- A **documenter** reflowing a `CHANGELOG.md` block on every PR wants Haiku-grade
  speed and cost — Opus here is money set on fire.
- A **spec writer** or **UX designer** wants Fable's voice/framing control — the
  spec is a narrative artifact and its quality cascades through the whole plan.
- A **builder** executing plan tasks wants Sonnet's balance — the workhorse
  coding model industry-wide, and the right default when TDD is doing most of
  the correctness work.

The existing superpowers workflow already anticipates specialisation
(`/subagent-driven-development` explicitly spawns "a fresh subagent per task"),
but the mechanism for *what kind of subagent* is left implicit. This spec
formalises it as eight named **roles**, each backed by a specific Claude model,
propagated into every stamped Manfred project via `bootstrap.mjs` and the
overlay manifest.

## 2. Goal

Ship a role system that:

1. Names eight roles covering the full agile product-team pipeline
   (strategise → spec → design → build → test → deliver, plus documentation
   throughout).
2. Binds each role to a specific Claude model via `.claude/agents/*.md`
   frontmatter, so `Agent({subagent_type: "tester", ...})` in Claude Code
   spawns Opus, no per-call model override needed.
3. Also lives as a human-readable convention (`knowledge/roles.md` +
   `AGENTS.md` router table) so humans and non-Claude-Code agents can play the
   same roles by hand.
4. Rides the existing bootstrap distribution — both `new` and `overlay` modes —
   so every current and future Manfred repo inherits the same role set.
5. Does not change `bootstrap.mjs` logic (data-driven via
   `overlay.manifest.json`).

## 3. Locked-in decisions

| Decision | Choice |
|---|---|
| Enforcement mechanism | **Option C** — both `.claude/agents/*.md` files (harness-enforced model binding) **and** a `knowledge/roles.md` convention doc (human-readable fallback) |
| Role count | **Eight** (see §4) |
| Role router location | `starter/AGENTS.md`, new section above the existing rhythm |
| Router shape | Task→role→model table **plus** a short "wear the hat vs. dispatch a subagent" paragraph |
| `tools:` frontmatter | **Omitted** on all 8 files initially (all tools available); lock-down deferred to a follow-up ticket once roles are exercised |
| Analyst model | **Fable** (narrative specs are Fable's sweet spot) |
| Top-level dogfooding | Duplicate the 8 role files at the manfred-bootstrap repo root, with a byte-identical test to prevent drift |
| Bootstrap script logic | **No changes** — the manifest is data-driven; adding files to the array is enough |

## 4. The eight roles

### 4.1 Guiding heuristic — four buckets, one model each

| Bucket | Why | Model | Roles |
|---|---|---|---|
| **Narrative** | Voice, framing, tone matter more than raw reasoning | **Fable** | strategist, analyst, designer |
| **Rigor** | Adversarial reasoning; correctness dominates | **Opus 4.7** | architect, tester |
| **Workhorse / tool-fluent** | Volume-heavy implementation loop or careful multi-step tool handling; quality-per-token wins | **Sonnet 4.5** | builder, release-manager |
| **Mechanical** | High-throughput, low-judgment doc passes | **Haiku 4.5** | documenter |

Cost/leverage profile: 3× Fable at the top of the funnel (a bad spec cascades
into weeks of wrong work), 2× Opus where correctness dominates, 2× Sonnet on
the volume/tool-fluent roles (builder does most of the token spend;
release-manager needs careful multi-step tool handling), 1× Haiku on the
mechanical role that runs on every PR.

### 4.2 Role catalogue

| # | Role | Owns | Model | Owning superpowers step |
|---|---|---|---|---|
| 1 | `strategist` | Outcome framing, target user, success criteria, "should we build this" | Fable | pre-`/brainstorming` framing |
| 2 | `analyst` | Approved spec, user stories, acceptance criteria | Fable | `/brainstorming` |
| 3 | `designer` | UX flow, IA, wireframes, tone of voice | Fable | inline during brainstorming; design-review pass |
| 4 | `architect` | Technical design, ADRs, bite-sized TDD plan | Opus | `/writing-plans`; `/requesting-code-review` (design compliance) |
| 5 | `builder` | Red→green→refactor, opens PR, iterates on CI | Sonnet | `/subagent-driven-development`, `/executing-plans` |
| 6 | `tester` | Failing test first, edge hunt, verification, behavioural review | Opus | `/test-driven-development`, `/verification-before-completion`, `/requesting-code-review` (behaviour) |
| 7 | `documenter` | CHANGELOG (in-PR), MEMORY + knowledge (post-merge), release notes | Haiku | interleaved; owns loop-close docs |
| 8 | `release-manager` | Squash-merge, Vercel deploy verify, 401-not-500 smoke, Linear auto-close, rollback | Sonnet | `/finishing-a-development-branch` steps 1–3 & 7 |

### 4.3 Explicit non-roles (folded in, not split out)

| Not a role | Why | Folded into |
|---|---|---|
| Reviewer | Two distinct-value reviews already exist (behaviour + design) | `tester` (behaviour) and `architect` (design) |
| DevOps / Releaser | Deploy is the tail end of build, but touching prod deserves its own model | Split — routine deploy is `release-manager`; rollback stays `release-manager` |
| Product Owner / PM | The human is the PM | `strategist` advises the human, does not replace them |

## 5. Invocation model

### 5.1 Where the two mechanisms plug in

**`.claude/agents/*.md`** — machine-enforced. The Claude Code harness reads
these files at session start. When the orchestrator calls
`Agent({subagent_type: "<role>", ...})`, the harness spawns a subagent bound to
the role's `model:` frontmatter. This is the primary enforcement path.

**`knowledge/roles.md` + `AGENTS.md` router** — human-enforced. Prose that the
orchestrator (top-level Claude) reads on every session so it knows *which role
to dispatch to* for a given task. Also serves as the reference for humans and
non-Claude-Code agents.

### 5.2 Wear the hat vs. dispatch a subagent

Not every role invocation should spawn a subagent. Two rules:

**Dispatch a subagent when:**

- The task holds a plan-task's worth of context (large enough to justify a
  fresh window).
- The role's model differs from the current session's model
  (e.g. the session is on Sonnet as builder and needs Opus-grade testing).
- Parallelism is wanted (`/dispatching-parallel-agents` — usually N testers
  or N analysts).

**Wear the hat yourself when:**

- The task is a single-edit doc pass or a two-line fix.
- The skill is interactive and needs to dialogue with the human
  (`/brainstorming`, `/writing-plans` — a subagent cannot dialogue).
- Spawning would cost more tokens than doing the thing.

The role file still functions as a behavioral checklist for the "wear the hat"
case; only the model binding is skipped.

### 5.3 Handoffs at loop-close

`/finishing-a-development-branch` currently lists 7 steps. They split as:

| Step | Owner |
|---|---|
| 1. Squash-merge | release-manager |
| 2. Pull `main` locally | release-manager |
| 3. Verify Linear ticket auto-closed | release-manager |
| 4. Update `MEMORY.md` | documenter |
| 5. Update `CHANGELOG.md` | documenter (though CHANGELOG additions ride *in* the PR per the existing rhythm; this step is for merge-related notes only) |
| 6. Graduate gotchas to `knowledge/` | documenter |
| 7. Delete feature branch (local + remote) | release-manager |

Plus one implicit step the Manfred convention already runs on every deploy:
the **401-not-500 protected-route smoke check** ("after every deploy, hit one
protected API route and confirm it answers 401, not 500, before trusting
crons"). Owned by release-manager and encoded in its role file so every
stamped project inherits the discipline.

## 6. File layout

```
manfred-bootstrap/
├── .claude/                              # ── TOP-LEVEL DOGFOODING ─────────
│   └── agents/                           # (byte-identical to starter/.claude/agents/)
│       ├── strategist.md
│       ├── analyst.md
│       ├── designer.md
│       ├── architect.md
│       ├── builder.md
│       ├── tester.md
│       ├── documenter.md
│       └── release-manager.md
│
├── starter/
│   ├── .claude/
│   │   └── agents/                       # ── STAMPED INTO EVERY PROJECT ───
│   │       ├── strategist.md
│   │       ├── analyst.md
│   │       ├── designer.md
│   │       ├── architect.md
│   │       ├── builder.md
│   │       ├── tester.md
│   │       ├── documenter.md
│   │       └── release-manager.md
│   ├── AGENTS.md                         # (+ Roles section)
│   └── knowledge/
│       └── roles.md                      # (new — human-readable convention)
│
├── overlay.manifest.json                 # (+ 9 new file entries)
├── scripts/
│   ├── bootstrap.mjs                     # (no logic change)
│   └── bootstrap.test.mjs                # (+ 3 assertions)
└── docs/
    ├── superpowers-workflow.md           # (+ Roles section)
    ├── ways-of-working.md                # (+ "The eight roles" section)
    └── ways-of-working-overview.md       # (+ Roles row in Tooling table)
```

## 7. Agent file shape

Every one of the 8 `.claude/agents/*.md` files follows this template:

```markdown
---
name: <role>
description: <one-line description; Claude Code shows this in the router UI>
model: <opus | sonnet | haiku | fable>
---

You are the **<Role>** on a Manfred product team.

## Job
- <3-5 bullets: what this role does>

## Inputs
- <what the role reads before starting: files, ticket, spec, plan task>

## Outputs
- <what the role produces, with concrete paths>

## You do NOT
- <explicit non-responsibilities, to prevent role creep>

## Governance
- Ask before destructive or irreversible actions.
- Return structured data, not prose — the orchestrator writes the conclusions.
- <role-specific escalation rules>
```

`tools:` is intentionally omitted (all tools available). This is a stated
follow-up: once roles are exercised for a few weeks, we'll know which tools
each actually needs and lock down accordingly.

### 7.1 Per-role frontmatter descriptions (final wording)

These strings ship verbatim in each file's `description:` frontmatter and
are what Claude Code shows in the agent picker.

| Role | Model | `description:` |
|---|---|---|
| strategist | fable | Frames outcomes, target user, success criteria, and "should we build this" before a spec is written. Advises the human PM; never writes production artifacts. |
| analyst | fable | Turns approved strategy into a spec at `docs/superpowers/specs/*.md` via `/brainstorming`. Owns user stories and acceptance criteria; waits for human approval before implementation begins. |
| designer | fable | UX flows, information architecture, wireframes, and tone-of-voice. Outputs live under `docs/design/`. Works alongside the analyst during brainstorming. |
| architect | opus | Technical design, ADRs, and the bite-sized TDD plan. Owns `/writing-plans`; produces `docs/superpowers/plans/*.md`. Reviews code for design compliance during `/requesting-code-review`. |
| builder | sonnet | Executes a plan task via red→green→refactor. Opens the PR, iterates on CI feedback, hands off to release-manager once approved. |
| tester | opus | Adversarial verifier. Writes the failing test first, chases edges, runs `/verification-before-completion`, reviews code for behavioural correctness. Never writes production code. |
| documenter | haiku | Maintains `CHANGELOG.md` (in-PR) and `MEMORY.md` + `knowledge/` (post-merge). Also drafts release notes and README updates. High-throughput, low-judgment doc passes. |
| release-manager | sonnet | Owns `/finishing-a-development-branch` steps 1–3 & 7: squash-merge, Vercel deploy verify, 401-not-500 protected-route smoke, Linear auto-close check, branch delete, rollback. Never writes production code. |

### 7.2 Per-role body outlines

Each body follows §7's template. The **Job / Inputs / Outputs / You do NOT**
bullets for each role:

**strategist**

- Job: frame the outcome; identify target user and success criteria; challenge
  "should we build this" before any spec is drafted.
- Inputs: the human's raw request; any relevant Linear tickets; recent
  `MEMORY.md` context.
- Outputs: a short framing note added to the top of the brainstorming
  conversation (not a file — advisory context for the analyst).
- You do NOT: write specs, plans, or production code.

**analyst**

- Job: run `/brainstorming`; convert strategy into an approved spec with user
  stories and acceptance criteria; wait for human approval before handoff.
- Inputs: strategist's framing note; existing docs/specs; codebase context.
- Outputs: `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`.
- You do NOT: write plans (architect), or code (builder).

**designer**

- Job: UX flows, information architecture, wireframes; establish tone of voice
  and interaction patterns.
- Inputs: approved spec; design-system reference (`@studio-manfred/manfred-design-system`);
  existing screens/mocks.
- Outputs: `docs/design/*.md` (new dir), Miro board links, or throwaway
  Playwright screenshots per the AGENTS.md pattern.
- You do NOT: implement components (builder), or write specs (analyst).

**architect**

- Job: turn spec into a bite-sized TDD plan; write ADRs for non-obvious
  technical choices; review code for design compliance in `/requesting-code-review`.
- Inputs: approved spec; existing architecture; knowledge/ base.
- Outputs: `docs/superpowers/plans/YYYY-MM-DD-<topic>-design.md`; ADRs under
  `docs/adr/*.md` if used.
- You do NOT: implement (builder), review for behaviour (tester).

**builder**

- Job: execute plan tasks red→green→refactor; open the PR with template filled;
  iterate on CI feedback until green; hand off at "PR approved" state.
- Inputs: approved plan; the specific plan task; codebase.
- Outputs: source-code changes; the PR itself.
- You do NOT: merge, deploy, update MEMORY/CHANGELOG post-merge.

**tester**

- Job: write the failing test first (regression or new-feature); confirm it
  fails for the right reason; hunt edges after builder goes green; run
  `/verification-before-completion`; review code for behavioural correctness
  in `/requesting-code-review`.
- Inputs: approved spec; the plan task; existing test suite.
- Outputs: test files under the project's test convention; a structured
  verification report.
- You do NOT: write production code; update docs; merge or deploy.

**documenter**

- Job: maintain `CHANGELOG.md` (during the PR — merge under the existing
  `[Unreleased] → Added/Changed/Fixed` heading, never prepend a new one);
  update `MEMORY.md` post-merge with a dated entry; graduate reusable
  gotchas up to `knowledge/`; draft release notes and README updates.
- Inputs: the merged PR; recent commit history; `knowledge/ERRORS.md`.
- Outputs: doc-file edits.
- You do NOT: write code; merge; deploy.

**release-manager**

- Job: after PR approval, squash-merge; verify the Linear ticket auto-closed
  via `Closes STU-NNN`; watch the Vercel deploy; run the 401-not-500 smoke
  check on one protected route; delete the feature branch locally and
  remotely; execute rollback if the deploy fails prod-smoke.
- Inputs: the approved PR; Vercel deploy URL; the protected route to smoke.
- Outputs: a merged `main`; a healthy prod deploy; a closed ticket; a deleted
  branch.
- You do NOT: write code, docs, or specs.

## 8. `starter/AGENTS.md` — new "Roles" section

Inserted **above** the existing "## The per-PR rhythm" heading:

```markdown
## Roles

You act in one of eight roles, each backed by a specific Claude model.

### Router

| Task | Role | Model |
|---|---|---|
| Framing outcomes | strategist | Fable |
| Turning strategy into a spec | analyst | Fable |
| UX / IA / tone of voice | designer | Fable |
| Technical design, plan | architect | Opus |
| Implementing a plan task | builder | Sonnet |
| Failing tests, verification, behavioural review | tester | Opus |
| CHANGELOG / MEMORY / knowledge / release notes | documenter | Haiku |
| Merge, deploy, smoke, rollback | release-manager | Sonnet |

### Wear the hat, or dispatch?

**Dispatch a subagent** when the task holds a plan-task's worth of context,
when the role's model differs from your session's, or when you want
parallelism.

**Wear the hat yourself** for single-edit doc passes, two-line fixes, or any
interactive skill that dialogues with the human (`/brainstorming`,
`/writing-plans`). Spawning a subagent for a two-line CHANGELOG edit costs
more than doing it.

See `knowledge/roles.md` for the full role definitions.
```

## 9. `starter/knowledge/roles.md` — new file

Prose reference; one H2 section per role. Structure per section:

```markdown
## <Role>

**Model:** <model>
**Owns:** <one-line summary>
**Superpowers hook:** <which skill(s) the role owns or contributes to>

### Purpose
<why this role exists>

### When to use
<the trigger conditions for dispatching or wearing the hat>

### Inputs
<what the role reads>

### Outputs
<what the role produces, with paths>

### You do NOT
<explicit non-responsibilities>

### Model rationale
<why this specific model for this specific role>
```

The file also gets a preamble that reproduces the router table from
`AGENTS.md` and links to each role's `.claude/agents/*.md` file.

## 10. `overlay.manifest.json` — 9 new files

Append to the `files` array (order does not matter — no logic depends on it):

```json
".claude/agents/strategist.md",
".claude/agents/analyst.md",
".claude/agents/designer.md",
".claude/agents/architect.md",
".claude/agents/builder.md",
".claude/agents/tester.md",
".claude/agents/documenter.md",
".claude/agents/release-manager.md",
"knowledge/roles.md"
```

Total count goes from 16 to 25. No new placeholder entries needed — the role
files are project-agnostic and do not use `{{PROJECT_NAME}}` /
`{{LINEAR_PREFIX}}` / `{{DESCRIPTION}}`.

## 11. `scripts/bootstrap.mjs` — no logic change

The bootstrap script is already data-driven:

- `new` mode copies `starter/` recursively — picks up the new `.claude/agents/`
  and `knowledge/roles.md` files automatically.
- `overlay` mode iterates `overlay.manifest.json` — picks up the 9 new
  entries automatically.

The only new touch is a single line in the script's `next-steps` output
reminding humans that role files live at `.claude/agents/` and are enforced
by the Claude Code harness. That output-only change lives inside the existing
`printNextSteps()` function.

## 12. `scripts/bootstrap.test.mjs` — 3 new assertions

Added as three new `node:test` cases (framework unchanged; run under
`node --test`):

1. **`new` mode creates all 8 agent files with parseable YAML frontmatter.**
   For each of the 8 role names, read
   `<target>/.claude/agents/<role>.md`; assert the file exists; extract the
   frontmatter block between the leading `---` fences; assert it parses as
   YAML; assert it has keys `name`, `description`, `model`.

2. **`overlay` mode copies all 8 agent files and `knowledge/roles.md`.**
   Run overlay against an empty tempdir; assert all 9 paths exist afterward.

3. **Every `model:` value is one of the allowed IDs.**
   For each of the 16 files (8 in `starter/.claude/agents/` + 8 at the
   top-level `.claude/agents/`), assert
   `model ∈ { "opus", "sonnet", "haiku", "fable" }`.

Plus one existing assertion **updated** rather than added:

- The current `new`-mode "file count" assertion (if any) needs to bump by
  the number of new files created under `starter/`.

Runtime impact: ~50 ms; well under the current sub-2-second budget for the
whole suite. Suite count moves from 19 to 22.

## 13. Top-level dogfooding

The manfred-bootstrap repo itself is edited under the same superpowers
workflow, so its own maintainers benefit from the roles too. Duplicate the
8 role files at `.claude/agents/*.md` in the repo root.

To prevent drift between the top-level copy and the `starter/` copy, add
a fourth new test:

4. **Top-level and starter agent files are byte-identical.**
   For each of the 8 role names, assert
   `readFileSync('.claude/agents/<role>.md') === readFileSync('starter/.claude/agents/<role>.md')`.

Suite count moves from 22 to 23.

If maintainers later want the two copies to diverge (e.g. meta-work roles),
they'd remove this test and accept the drift consciously.

## 14. Documentation updates

| File | Change |
|---|---|
| `docs/superpowers-workflow.md` | New "## Roles" section at the top; each subsequent step (`/brainstorming`, `/writing-plans`, `/subagent-driven-development`, `/dispatching-parallel-agents`, `/test-driven-development`, `/verification-before-completion`, `/requesting-code-review`, `/finishing-a-development-branch`) gains an inline "**Role:** `<role>`" line under its heading. |
| `docs/ways-of-working.md` | New section "The eight roles" (between existing sections; suggested position: after the current "Per-feature rhythm" section). Includes the four-bucket heuristic, the role catalogue table, and the model rationale in prose form. |
| `docs/ways-of-working-overview.md` | New row in the "Tooling at a glance" table: `Roles \| Eight named roles, each on a specific Claude model (Fable / Opus / Sonnet / Haiku). See `knowledge/roles.md`.` |
| `README.md` | One bullet in the "What this is" list: `**Role-based agents** — eight named roles (strategist, analyst, designer, architect, builder, tester, documenter, release-manager), each backed by a specific Claude model.` |
| `CHANGELOG.md` | Entry under `[Unreleased] → Added`, merging with the existing heading (never prepend a new heading block — the AGENTS.md rhythm warns against this). |
| `MEMORY.md` | Dated entry when this ships. Not written until the actual ship. |
| `docs/using-this-repo.md` | If it references file counts or specific overlay files, update. Otherwise leave. |

## 15. Risks and follow-ups

**In scope for this ticket:**

- All 8 role files exist and are valid.
- `overlay.manifest.json` lists all 9 new files.
- Bootstrap tests cover new/overlay/model-value/byte-identical.
- Docs updated.
- No changes to `bootstrap.mjs` logic.

**Explicitly out of scope (follow-up tickets):**

1. **`tools:` lock-down** — once roles are exercised for a few weeks, we'll
   know which tools each actually needs. File STU-NNN once the pattern is
   clear.
2. **Harness-level model-availability check** — a test that verifies the 4
   model IDs (`opus`, `sonnet`, `haiku`, `fable`) are actually accepted by
   Claude Code today. Protects against Fable availability drift. Cheap
   follow-up.
3. **Single source of truth for role files** — the byte-identical test is a
   band-aid; a future refactor could hoist to a single canonical location
   and generate/symlink the other copy. Wait until we know the shape holds.
4. **Deeper Linear integration** — the release-manager role could later
   automate Linear status transitions (currently governance-gated to human).

**Known risks:**

- **Fable availability drift.** If Fable is temporarily removed from Claude
  Code, the 3 Fable-bound roles silently fall back to whatever the harness
  picks. The follow-up harness-level test mitigates this; the risk is
  acceptable for v1.
- **Two-copy divergence.** The byte-identical test locks it. If someone
  removes the test to allow divergence, they must do it deliberately.
- **Orchestrator over-dispatch.** The router table + hat/dispatch paragraph
  mitigate this, but a real safety net is the human PM noticing costs. We
  will measure after 2-4 weeks and revisit if over-dispatch is a real
  problem.

## 16. Definition of done

All checked before merge:

- [ ] All 8 agent files exist under `starter/.claude/agents/*.md` with valid
      frontmatter (`name`, `description`, `model` all present).
- [ ] Every `model:` value ∈ `{ opus, sonnet, haiku, fable }`.
- [ ] All 8 agent files also exist at `<repo-root>/.claude/agents/*.md`,
      byte-identical to the starter copies.
- [ ] `starter/knowledge/roles.md` exists with one H2 section per role plus
      the router preamble.
- [ ] `starter/AGENTS.md` has a "## Roles" section with the router table and
      the "Wear the hat, or dispatch?" paragraph, inserted above the
      per-PR rhythm.
- [ ] `overlay.manifest.json` lists all 9 new files; `files` array size = 25.
- [ ] `scripts/bootstrap.test.mjs` includes the 4 new assertions
      (new-mode YAML, overlay copies, model values, byte-identical);
      total suite count = 23 and all green.
- [ ] `docs/superpowers-workflow.md`, `docs/ways-of-working.md`,
      `docs/ways-of-working-overview.md`, `README.md` all updated per §14.
- [ ] `CHANGELOG.md` has an entry under `[Unreleased] → Added`, merged into
      the existing heading (not prepended as a new block).
- [ ] `MEMORY.md` gains a dated entry at ship time (last commit of the PR).
- [ ] All existing tests still pass; no regressions.

## 17. References

- Ticket: [STU-917](https://linear.app/studio-manfred/issue/STU-917/role-based-agents-8-roles-model-per-role-dispatch)
- Related spec: `docs/superpowers/specs/2026-06-06-my-process-wow-scaffold-design.md`
  (the original bootstrap design; establishes the manifest and starter
  conventions this spec extends)
- Superpowers workflow: `docs/superpowers-workflow.md`
- Ways of working: `docs/ways-of-working.md`
- Existing agent conventions: `starter/AGENTS.md`, `starter/CLAUDE.md`
