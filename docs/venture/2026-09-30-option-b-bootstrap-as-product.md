# Option B — Bootstrap as a product

> **Executive summary:** Turn `manfred-bootstrap` into a paid dev-platform product. Free/OSS core; paid platform tier that hosts the role catalogue, ships opinionated CI/CD scaffolding, ledgers agent runs across a team, and integrates with existing coding assistants (Cursor, Copilot, Claude Code). Doesn't compete with the IDE tools — sits on top of them. Higher ceiling than A but much higher capital requirement and more competitive risk. Best played as a **layer that grows out of Option A** once we have 5–10 paying clients funding the R&D.

## 1. Where we are today

- **The core exists.** `manfred-bootstrap` is a working template repo with `bootstrap.mjs`, 8 role files, DS-first workflow, superpowers, Linear discipline. 26 tests, top-level dogfooding. Battle-tested internally.
- **The bootstrap is private.** All Manfred repos are private today. Going public is a decision (OSS-first strategy is a real choice, not automatic).
- **No hosted layer.** Everything runs locally today. There's no "log in and see your team's agent runs" platform.
- **No paid customers, no waitlist, no landing page.**
- **Adjacent tooling exists.** Manfred design system publishes as a package. Precedent for public-facing packages under `@studio-manfred/`.
- **No dedicated product-eng team.** Building the platform requires people beyond Jens.

## 2. Vision

**5 years out:** The default operating system for how AI-first product teams work. Free CLI + role catalogue used by tens of thousands of individual developers. Paid platform tier used by 200–800 teams. Enterprise tier for regulated / large-team buyers. **$8–20M ARR steady state.**

**Signal we're winning:** the CLI has 5-figure GitHub stars; new roles/workflows are contributed by the community; teams mention `manfred-bootstrap` in their engineering blog posts unprompted; enterprise sales cycle exists but is warm because engineers below have already adopted the free tier.

**Not the vision:** competing with Cursor or Copilot on autocomplete. We integrate with them, we don't replace them. We're the process/discipline layer, not the IDE.

## 3. How we get there

**Fall 2026 (October–December):**
- **Publish `manfred-bootstrap` as a public OSS repo** under a permissive license (MIT or Apache 2.0). Real dogfooded methodology + tools; community pull requests welcome.
- Launch a small **waitlist landing page** for the hosted platform ("early access — Q1 2027").
- Ship the **v0.1 of a role registry** — a queryable index of roles + their model bindings, hosted at a subdomain, populated by the OSS repo's catalogue.
- Start a **weekly changelog + short essay** on the domain — early SEO and thought-leadership foundation.

**Q1 2027 (January–March):**
- **Paid platform beta.** 50–100 teams invited from the waitlist. Free during beta.
- Hosted features: team-wide role catalogue, ledger dashboard (agent runs, rulings, outcomes), Linear/GitHub integration, per-role model cost analytics.
- **First paid tier launched.** Target: €49–99/team/month starter, €199–499/month team, €1500+/month for enterprise custom.
- Recruit **1–2 product engineers** and a **founding DevRel**.

**Q2–Q4 2027:**
- **Self-serve funnel** live (landing → signup → onboard → trial → paid). Instrument thoroughly.
- **Enterprise tier** with SSO, audit log, compliance basics (SOC 2 Type I on the roadmap).
- **Community-driven role library** — the platform's real defensibility (harder to fork if the value is community-maintained).

**2028+:**
- Multi-language support (roles for Python, Go, Rust codebases — today's bootstrap is Node/React heavy)
- Marketplace for third-party role definitions
- Deep integrations with Cursor, Copilot, Claude Code, Windsurf (they benefit from having a shared discipline layer above them)

## 4. Customer needs

**Buyer persona:** Engineering leader at a team that has already bought AI coding tools and is asking "why aren't we shipping faster?"

Two sub-personas:

- **Platform / DevEx engineer** at a 30–200-engineer product company. Their job is standardising the dev environment. They buy tools that reduce variance across the team.
- **CTO / VP Eng** at a smaller company (10–40 engineers) who wants the whole team on one operating system.

**Symptoms they describe:**
- "Every engineer uses AI tools differently — Cursor / Copilot / Claude Code / ChatGPT. There's no shared practice."
- "Our AI spend is growing but we can't measure ROI."
- "We onboard engineers with a 30-page Notion doc that they don't read."
- "We can't see across the team how AI actually gets used — no observability."
- "We want to enforce our review + spec discipline but nobody follows it."

**Trigger events:**
- Platform-team formation
- Failed AI adoption ("we bought Copilot for everyone but nothing changed")
- Audit / compliance request ("show me how AI is used in your dev process")
- Cost review ("our LLM spend doubled — is it worth it?")
- CTO change

**What they buy from us:**
- Free CLI + open OSS repo (adoption tier)
- Hosted role catalogue + team dashboard (paid team tier)
- Cross-team ledger + observability + cost analytics (paid platform tier)
- Enterprise integrations, SSO, audit, RBAC (enterprise tier)

**What they don't buy from us:**
- An IDE (that's Cursor / VS Code)
- A model (that's Anthropic / OpenAI)
- A ticket system (that's Linear / Jira)
- General AI advice (that's a consultant — Option A territory)

## 5. Market

### Global

- Total dev-tools market: **~$30B**
- AI dev-tools sub-segment: **~$8B+** and growing fast (Cursor alone $2B ARR, Cognition $492M ARR, Copilot much larger)
- Small-team / SMB tail (target): ~200,000+ teams globally at the "we use AI tools" tier; **paid conversion rate assumption: 1–3% → 2,000–6,000 addressable paying teams**
- Enterprise segment: ~5,000 enterprises worldwide with real AI dev spend — of which we might realistically address the "modern eng leadership" tier of ~500

### Europe

- ~$3B AI dev-tools slice of European market
- Strong data-residency preference plays to our favour (EU-hosted platform can win vs. US-only competitors in regulated industries)
- English-first works everywhere; French/German nice-to-have on the roadmap

### Sweden

- Direct market small (Sweden's total tech company count is a fraction of a % of global)
- Strong export story via English-first
- Nordic + DACH combined is the *right* first-market wedge post-Sweden

### Stockholm

- Low direct market share, but **strong ecosystem position**: the local investor and talent networks respect deep-technical products
- Adjacent competitors emerging (**Lovable**, **Pit** — $16M, "AI-native platform for custom enterprise operational software"), each in a slightly different lane
- Nobody has yet claimed the "process discipline on top of AI dev tools" position — the window is open in 2026 but won't stay open in 2027

## 6. Risks

### Desirability

- **Confusion with Cursor / Copilot.** Every buyer conversation starts with "how is this different?" **Mitigation:** the OSS core is the demo; a team can install `bootstrap` and see the difference in 15 minutes without a sales call.
- **"We can build this internally."** Platform-team buyers might prefer to roll their own. **Mitigation:** the community-maintained role library is what they can't build alone. Also lean into the OSS core — they get 80% for free, and pay for observability + team features.
- **Buyer readiness.** Many teams still haven't fully absorbed Cursor / Copilot. The layer above may be too early. **Mitigation:** run the waitlist through 2026 and watch signup rate before committing to platform build.

### Feasibility

- **Product-eng team required.** This isn't a solo build. Realistically **3–5 engineers + DevRel + product** to build the platform tier.
- **Hosting + observability + auth infrastructure** is real ongoing cost (Supabase or Neon + Vercel + Sentry + Segment = €500–2000/month baseline before real usage).
- **Distribution challenge.** OSS-first can work but requires consistent content + community effort. If we don't have a full-time DevRel by Q2 2027, the community layer won't materialise.

### Viability

- **CAC vs. self-serve conversion.** Self-serve SaaS has notoriously slow ramp — expect 12–18 months before predictable unit economics. **Mitigation:** the Option A retainer clients are the first paid platform customers, so we don't start from zero.
- **Competition from foundational-model companies.** Anthropic, OpenAI, GitHub all *could* build this layer themselves. **Mitigation:** they've historically preferred partnerships over building process/discipline layers — but this could change.
- **Requires real capital.** €1–3M seed round is honest sizing. Bootstrapping this option alone is not viable — you can bootstrap Option A and *fund* Option B from Option A revenue, which is the recommended path.

## 7. What's needed to start

**People (through Q1 2027):**
- 2 product engineers (senior, full-stack, comfortable with agent tooling)
- 1 founding DevRel (writer + speaker + community-builder)
- 1 product / design lead (part-time until Q2 2027)
- Jens as founder / spokesperson

**Capital:**
- **Not bootstrap-viable alone.** Realistic seed: **€1–3M**, 18–24 month runway
- Alternate: fund Option B from Option A's retainer cash flow — slower ramp but no equity dilution

**Infrastructure:**
- OSS repo hosting (already in place: GitHub)
- Landing page + waitlist (Cursor-style — one page, one email, one call-to-action)
- Hosted platform stack: Vercel + Neon Postgres + Auth (Clerk or WorkOS) + observability (Sentry + Vercel Analytics)
- LLM API access (Anthropic + OpenAI keys with production quotas)

**Partnerships:**
- Cursor / Copilot / Claude Code / Windsurf teams — early integrations partnerships (they benefit from a "process layer" that makes their tools stickier in enterprise sales)
- Design system partnerships (extending the DS-first pattern to shadcn/ui, Material, Fluent — massive addressable market of teams already using these)
- Vercel / Neon / Anthropic — for co-marketing case studies

**Legal / IP:**
- Public OSS licence chosen and enforced
- Contributor License Agreement (CLA) — protect the ability to relicense parts commercially if needed
- Trademark on "Manfred" (or new name if we rebrand)
- Data-processing agreements for enterprise (SOC 2 on the roadmap)

## 8. Brand and marketing

### Positioning

**One-liner:** _"The operating system for AI-first product teams."_

**Value promise:** _"Your team on one shared way of working — installed in an hour, observed across every engineer, priced per team."_

**Anti-positioning:** we are not an IDE. We are not a model. We are not a ticket system. We are the layer that ties them together with shared discipline.

### Voice

- Developer-native. Docs > slides. Diffs > diagrams.
- Opinionated but not dogmatic — we ship *a* way of working, not *the* way.
- Community-first — the OSS repo is the public face; the paid product is the invisible scale layer

### Channels (first 6 months post-launch)

1. **OSS repo — GitHub stars as the north-star early metric.** Every commit is a marketing signal.
2. **DevRel-led content.** Blog + YouTube + talks at platform-eng events (Platform Engineering Day, LeadDev, KubeCon dev-tools track).
3. **Hacker News launches.** OSS launch (Fall 2026), platform beta (Q1 2027), enterprise tier (Q3 2027).
4. **Product hunt for beta launch.**
5. **Integrations as marketing.** Every partnership with a Cursor / Copilot / Claude Code / Windsurf gets a co-branded post.
6. **Newsletter.** Weekly "how one team shipped this week" — real diffs from real teams (Option A clients are the well).
7. **Enterprise waitlist.** Explicit "join the enterprise waitlist" for the top of funnel.

### Brand architecture

**Recommendation:** if Option B is greenlit, the product deserves a **distinct product brand** — Manfred is Jens's studio; the platform is bigger than that and should be positioned as such.

Working names (placeholder — deserves a proper naming process): _Manfred Platform_ (bland but instantly credible), _Ops OS_, _Roll Call_, _Ledger_ (bad — already taken by finance products). Names TBD in Q4 2026.

**Domain acquisition:** budget €5–20K for a decent .com or .dev in Q4 2026.

### First 6-month plan (post-Option-A validation)

Assumes we've decided Option B is worth investing in — which happens after Option A validates the client-side story (~Q2 2027).

| Month | Action | Success signal |
|---|---|---|
| Month 1 | Ship OSS repo public. Waitlist landing. First 3 essays. | 100 GitHub stars, 100 waitlist emails |
| Month 2 | First 3 role-registry contributions from the community. | External PR merged |
| Month 3 | Beta invitation to top 50 waitlist teams. | 20 teams onboarded |
| Month 4 | Platform tier priced and launched. First 5 paying teams. | €500 MRR |
| Month 5 | Second product engineer hired. Community forum + weekly office hours live. | 15 paying teams |
| Month 6 | HN launch. Public pricing page. First enterprise sales conversation. | €5K MRR, first enterprise SOW |

If we're at 15+ paying teams and €5K+ MRR in 6 months, Option B is real. If we're stuck at 3–5 teams, we've built infrastructure ahead of demand and go back to Option A's retainer economics as the primary bet.
