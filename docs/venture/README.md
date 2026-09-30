# Venture scoping — Fall 2026 → Q1 2027

This directory is the working scoping folder for the new Manfred venture that grew out of the STU-917 → STU-980 arc: the eight role-based agents, the DS-first handoff pattern, the Linear-as-join-key discipline, all proven end-to-end when whiteboard's `ColorPicker` shipped in ~2.5 hours real time across three repos.

The observation: this isn't just internal tooling. It's a **methodology + toolchain + coaching** stack that can be sold to product-tech companies who are (a) all-in on AI dev tools but (b) not shipping any faster because of it.

The Fall 2026 → Q1 2027 plan: three business experiments in parallel, one company started in Q1 2027 on whichever wedge holds. This folder documents the three candidate positions.

## The three options

Each is a full write-up. Read the executive summary at the top of each; if it hooks you, read the whole thing.

1. **[Option A — AI product ops as a service](./2026-09-30-option-a-product-ops-as-service.md)** _(recommended wedge)_
   Embed with 4–8 client teams per year, upskill their engineers on the Manfred way, leave them shipping faster than they were before. Hybrid retainer + onboarding project.

2. **[Option B — Bootstrap as a product](./2026-09-30-option-b-bootstrap-as-product.md)** _(scale layer that grows out of A)_
   Turn `manfred-bootstrap` into a paid dev-platform product with subscription tiers. Self-serve funnel; competes on process discipline layered on top of Cursor/Copilot/Devin.

3. **[Option C — The Manfred way, licensed](./2026-09-30-option-c-methodology-licensed.md)** _(thought-leadership follow-on)_
   Codify the WoW as books, courses, certifications. Author-brand play, similar to Shape Up (Basecamp), Team Topologies, or Accelerate. Small team, high margin, slow compound.

## The Q4 2026 plan

- **[The Q4 2026 plan — story arc, gaps, experiments](./2026-09-30-q4-2026-plan.md)** _(read this after the option docs)_
  Ties the three options into a sequenced chronology, enumerates the 10 honest gaps and how each closes, and defines three concrete parallel experiments (one per option) with hypotheses, ship lists, success signals, cost caps, and kill criteria. Plus the Q1 2027 decision framework — how we read the signals to pick the wedge.

- **[Open questions](./2026-09-30-open-questions.md)** _(working list; every question has an owner)_
  Everything still waiting for a decision, a conversation, or a paid expert. Structured across founder / stakeholders / market / legal / brand / product / existential, with an "answer by" deadline against each. Distinct from the honest gaps — those close through experiments; open questions close through people. The last section lists the 5 that need to be answered before October ends.

- **[Market context (end September 2026)](./2026-09-30-market-context.md)** _(dated snapshot, redo quarterly)_
  Triangulation of where the global economy, VC market, Nordic economy, AI industry, and enterprise buyer behaviour sit right now, and what each means for our Q4 experiments. Key finding: the AI-tools layer consolidated into Big Tech in one week in June 2026 (SpaceX bought Cursor for $60B, OpenAI bought Windsurf for $3B), which closes some doors and opens others for the "process layer on top of AI tools" position we're aiming at.

## Adversarial

- **[CHALLENGE-ME](./CHALLENGE-ME.md)** _(the doc that argues against the venture)_
  The strongest possible case against the current plan. Weakest links in the pitch, over-optimistic assumptions, business-model risks, ideology risks, alternatives we haven't considered, and a pre-mortem imagining four ways this fails by Q4 2028. Rules: every challenge is "believed until proven wrong," answers get ledgered in git, and unanswered challenges past 6 weeks are serious flags. Invited to be edited by anyone — investors and advisors specifically welcome to add their own challenges.

## For specific conversations

- **[SeventyOne Group founder deck](./2026-09-30-seventyone-group-deck.md)** _(discussion aid, not a pitch)_
  20-slide markdown deck for a ~60-minute conversation with David + Håkan (SeventyOne Consulting), Moa (Mather Studio), and Jens (Studio Manfred). Covers where each firm is today, what's changed in the market, the venture opportunity, the three plausible structures for where it fits in the Group, an equity/governance sketch, timeline, decision framework, and specific asks for each attendee. Includes presenter's-notes on running the discussion.

## How they fit together

They aren't mutually exclusive.

- **A is the wedge.** It funds itself from day 1, produces real case studies fast, and its client work is the R&D pipeline for B.
- **B is the scale layer.** The tooling that A embeds in every client eventually gets packaged and sold self-serve. A's clients are its first buyers.
- **C is the flywheel.** The content, book, and courses generate inbound for A, and legitimise B in the market.

Chronologically we should probably think: **A first, B second (once 4–5 clients validate the toolchain), C third (once we have a book's worth of published case studies).**

The Fall 2026 experiments should each test one of A / B / C separately to know which order the market actually rewards.

## The evidence base

Before reading the options, worth grounding in what's already proven:

- The Manfred bootstrap ships a full role-based agent system (STU-917, 8 roles, model-per-role: Fable/Opus/Sonnet/Haiku) with 26 tests and top-level dogfooding.
- The DS-first handoff pattern (STU-977, STU-978) lets consumer teams file component requests to a specialist inbox and continue with stubs.
- Whiteboard shipped `ColorPicker` end-to-end using this pattern in ~2.5 hours — from consumer discovering the DS gap to feature merged and deployed to prod (STU-979, STU-980, STU-981, STU-982).
- Every artifact — spec, plan, PRs, rulings, follow-up tickets — was captured in git and Linear. No knowledge lost between sessions.

The pitch to any prospective client is not "we can build you an AI process." It's "we already have one, here's the git log of us using it, and here's how we'll install it in your team in 8 weeks."

## Tracking

- Linear parent: [STU-985](https://linear.app/studio-manfred/issue/STU-985/venture-scoping-ai-first-product-ops-company-fall-2026-q1-2027)
- Branch history: `feat/STU-985-venture-scoping-docs` and follow-ups
- Session origin: the ~2.5-hour DS-first end-to-end proof on 2026-09-29 (captured in root `MEMORY.md`)

## What's not here yet

- Financial model (P&L, cash flow, LTV/CAC per option)
- Legal/entity structure options (svenskt AB, holding, parent-Manfred vs. spinout)
- Investor deck
- Term-sheet templates for the shared-IP model
- Detailed experiment slate for Fall 2026

These are follow-ups. This scoping folder is the "which door do we open" pass; the numbers come once one option gets picked.
