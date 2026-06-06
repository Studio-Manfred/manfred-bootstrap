# Deck outline — How I build software with AI

- **Engagement:** Workshop / training talk
- **Date:** 2026-06-01
- **Audience:** External / clients (mixed technical depth)
- **Goal:** Demystify how I actually work with AI — inform & show, no commitment expected. People leave understanding that AI-assisted development can be disciplined and trustworthy.
- **Length / format:** 45–60 min, live, with a real worked-example walkthrough (STU-501)
- **Deck:** reveal.js HTML — `presentations/ai-development-workflow-2026-06-01.html`
- **Sources:** [docs/ai-development-workflow.md](../docs/ai-development-workflow.md) + [docs/ai-development-workflow-overview.md](../docs/ai-development-workflow-overview.md)

## Structure (Hook → Context → Journey → Solution → Evidence → Ask)

| # | Section | Slide | One idea |
|---|---|---|---|
| 1 | Hook | AI doesn't write my code — it follows my process | Reframe: discipline, not autocomplete |
| 2 | Hook | The fear vs the promise | Name the tension the room feels |
| 3 | Context | The naive way breaks | Prompt-paste-hope has no memory, no tests |
| 4 | Context | The shift | AI as a disciplined teammate; leverage is the process |
| 5 | Context | Three files do the work | AGENTS → CLAUDE → MEMORY, read every session |
| 6 | Journey | The pipeline | Idea → ship → learn, one loop |
| 7 | Journey | It starts with a question | Brainstorm hard-gate; the footer that stopped on "wait" |
| 8 | Journey | The ticket before the branch | STU-NNN is the join key between code and tracker |
| 9 | Journey | A failing test is the best prompt | TDD as the steering wheel |
| 10 | Solution | TDD with AI | Red/green/refactor; extract a helper, not the 1000-line page |
| 11 | Solution | The testing pyramid | Five layers, each matched to a risk |
| 12 | Solution | Accessibility is built in | axe + ARIA + WCAG, warn→enforce |
| 13 | Solution | Many agents, one judge | Parallelism for coverage, skeptics for confidence |
| 14 | Solution | Security at the chokepoint | One guard + one test that can't regress |
| 15 | Solution | Real infra before merge | Vercel preview per PR + CI gates |
| 16 | Solution | Ratchets only tighten | Coverage up-only; warn→enforce; test.fail() |
| 17 | Evidence | One real feature, start to finish | Set up the STU-501 walkthrough |
| 18 | Evidence | Ticket → branch → red→green | The helper TDD in action |
| 19 | Evidence | Proven by deletion | Swap old code back, watch 3 E2E tests go red |
| 20 | Evidence | Green → merge → learn | 224 tests, ratchet, auto-close, memory note |
| 21 | Evidence | When the review is clean, say clean | The security review that found nothing — and reported nothing |
| 22 | Ask | Five things to take home | The transferable principles |
| 23 | Ask | The human stays in control | Governance guardrails — what the AI must ask first |
| 24 | Ask | Write your process where your AI reads it | The one thing to try this week + where the docs live |

## Voice pass notes
- No marketing verbs (transform/empower/leverage/unlock/supercharge/drive/deliver value).
- No corporate adjectives (cutting-edge/world-class/innovative/best-in-class/passionate).
- First slide is the hook, not a title card.
- Last slide is the ask/takeaway, not "Thank you / Q&A".
- Jargon (Linear, CI, TDD, RLS, Vercel) gets a half-line gloss for the external audience.
