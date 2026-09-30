# Option A — AI product ops as a service

> **Executive summary:** We embed with small-to-mid product-tech companies (10–100 engineers), install the Manfred way (bootstrap + role-based agents + DS-first + WoW discipline) in 4–8 weeks, and retain a hybrid recurring engagement afterwards. We sell an outcome — measurable ship-rate acceleration — not hours. This is the most defensible wedge because nobody else has a proven, documented, off-the-shelf methodology with real production shipping evidence.

## 1. Where we are today

- **Proven methodology.** The Manfred bootstrap ships a complete role-based agent system (8 roles, per-role Claude model), DS-first handoff pattern, Linear-as-join-key discipline, and superpowers workflow. All open in `manfred-bootstrap`; all dogfooded on live client-adjacent code (whiteboard, design-system, this session).
- **Real production evidence.** On 2026-09-29 we shipped a new DS component and integrated it into a consumer app in ~2.5 hours end-to-end. Every step is in git and Linear. Every specialist role behaved as designed. Two API deviations, one broken release, one CSS import gotcha — all captured and recovered from.
- **No commercial motion yet.** No client, no case study, no pricing tested, no legal entity.
- **Team primitives in place.** Jens (Manfred founder, primary operator). Moa and Selma have already contributed to Manfred repos and could plausibly be embed-team candidates.
- **Bootstrap-eligible.** No investor money needed to run the first three pilots at cost or reduced rate — cash pays only for legal, tooling, and a modest go-to-market budget.

## 2. Vision

**5 years out:** A trusted product-ops partner to a portfolio of 20–30 product-tech teams in the Nordics + English-speaking EU, embedded through hybrid retainer engagements that materially and measurably accelerate their ship rate. Small team (5–10), productised delivery, ~$3–6M ARR steady state, high gross margin (~70%+), high referral rate.

**Signal we're winning:** clients renew because their internal ship metrics moved, not because of the relationship; every new client comes from a referral or a published case study; the delivery playbook is boring enough that a new operator can run their first engagement solo within six months of joining.

**Not the vision:** a body-shop consultancy that scales by hiring. If we can't productise the delivery, we don't build the company.

## 3. How we get there

**Fall 2026 (October–December):**
- Publish 3–5 short case-study posts based on today's session and prior Manfred work (STU-980 in 2.5 hours; STU-979 ColorPicker end-to-end)
- Recruit 3 pilot clients at reduced rate (target: 1 Series A, 1 Series B, 1 mid-market)
- Deliver the pilots — 4-week embed → 8-week retainer window
- Instrument each pilot: baseline ship rate → post-embed ship rate → 12-week trailing
- Fix the pricing model based on what clients actually pay for

**Q1 2027 (January–March):**
- Form the entity (Swedish AB)
- Convert best 1–2 pilots to full-price retainer contracts
- Publish the first "here's what we do and how much it costs" landing page
- Fill the pipeline to 4–6 paying clients by end of Q1

**Q2–Q4 2027:**
- Scale to 8–12 concurrent retainers
- Hire 1–2 delivery operators (embed-capable, senior)
- First productised platform component (probably the `bootstrap.mjs` + hosted role library)
- Investor conversation for growth capital *if* the platform layer is showing signal (Option B glow-up)

**2028+:**
- Steady state: 20–30 retainers, 5–8 team, platform layer at ~20–30% of revenue

## 4. Customer needs

**Buyer persona:** VP Engineering or CTO at a product-tech company with 10–100 engineers, 12–36 months post-Series-A, revenue growing but engineering throughput not scaling in line with headcount.

**Symptoms they'll describe:**
- "We bought Cursor / Copilot for everyone. It didn't move our roadmap."
- "Every new hire onboards differently and it takes 6 weeks."
- "We can't tell if we're actually shipping faster."
- "Our design system exists but nobody uses it consistently."
- "Every project reinvents the same infrastructure."

**Trigger events:**
- Post-layoff (need to do more with less)
- Just doubled the team (onboarding pain hits)
- New CTO or CPO arriving (wants to establish a way of working)
- Missed a roadmap quarter (board question about velocity)
- Failed AI initiative ("we hired Devin, why aren't we faster?")

**What they buy from us:**
- The Manfred bootstrap installed in their repos (day 1)
- Role-based agent system running against their team's Linear/Jira (week 1–2)
- DS-first workflow adopted for their existing design system (week 2–4)
- Playwright + Vitest + axe test discipline (week 3–4)
- 4 weeks of paired shipping with their team (week 4–8)
- Ongoing retainer: monthly office hours, per-project support, tooling updates

**What they don't buy from us:**
- Code we wrote for them (we ship code with them, not for them)
- Full-time staff augmentation
- AI strategy slides (we run experiments; we don't write memos)

## 5. Market

### Global

- SaaS + product companies with 10–100 engineers: rough estimate **40,000+ companies globally**
- Enterprise AI transformation consulting TAM: **~$50B** (includes megaproject Accenture-style engagements — not our slice)
- Addressable slice for small-to-mid product ops: **~$5–10B** (educated guess; treat as directional)
- a16z estimates AI-augmented software development represents **$3T annual value creation** by end-decade; we're selling the *organisational layer* that unlocks a share of that value at the team level

### Europe

- ~8,000 product-tech companies in target size range
- Nordics + DACH + Netherlands + Ireland ≈ **2,000 companies** where English-first delivery works
- Strong VC-backed cohort of Series A/B companies eager to prove capital efficiency

### Sweden

- ~500 SaaS/product companies in the 10–100 engineer band (est.)
- Well-capitalised local funders (EQT Ventures, Creandum, Northzone, Luminar) with portfolios full of exactly this profile
- Strong pedagogical culture — the market will pay for a well-taught methodology
- Language advantage: Swedish for local, English for everywhere else, no translation burden either way

### Stockholm

- **105 funded AI startups** locally (Seedtable)
- Top 60 have raised **$4.2B combined**
- Warm-intro paths via Creandum/EQT/Northzone portfolios
- No direct competitor doing embedded AI product ops (competitors are either seat-sales like Cursor, transformation-consulting like Accenture, or boutique AI advisory)

## 6. Risks

### Desirability (do they want it?)

- **"Yet another consultancy"** — buyer skepticism is real. **Mitigation:** open every conversation with the git log, not the slide deck. Every prospective client sees today's `STU-980` PR chain and asks "you did this in 2.5 hours?"
- **"We already bought Cursor"** — buyer confused about layering. **Mitigation:** position as *what they do after they bought Cursor* — the process discipline that unlocks the tool's value.
- **"Nobody wants embedded consultants anymore"** — post-COVID remote-first bias against embed. **Mitigation:** embed is hybrid (2 days/week onsite + async), not full-time colocation. Pilot signals will tell us if this holds.

### Feasibility (can we do it?)

- **Delivery scales linearly with people** unless the toolchain productises. **Mitigation:** build the platform layer alongside client work from month 1; every client engagement produces reusable primitives.
- **The methodology is Jens-shaped** today — hard to hand off. **Mitigation:** the bootstrap already codifies most of it (roles, WoW docs, superpowers). Fall 2026 pilots test whether a second operator can deliver from the codified version.
- **Client heterogeneity** — every codebase is different. **Mitigation:** first three pilots picked to represent the diversity (backend-heavy vs. frontend-heavy, monorepo vs. multi-repo, DS-consuming vs. bespoke).

### Viability (does the business work?)

- **Retainer economics.** Target: €8–15K/month per client, hybrid model. 8 clients at €10K/month = €960K ARR — enough for 3-person team + overhead. 15 clients at €12K = ~€2.2M. Achievable but requires steady close rate.
- **CAC vs. sales cycle.** Ballpark 4–8 month cycle for a 12-month retainer. If we lean on referrals + published case studies, CAC stays low; if we have to buy pipeline, unit economics get tight.
- **Pilot conversion risk.** If pilots don't convert to full-price contracts, the business hasn't been validated. **Mitigation:** structure the pilots so the pilot fee credits toward the first contract — reduces buyer risk without giving away the work.

## 7. What's needed to start

**People (Fall 2026):**
- Jens as primary operator + spokesperson
- 1 senior collaborator (embed-capable) — could be recruited from Manfred network (Moa or Selma?)
- Part-time designer for marketing collateral
- Fractional legal (for contracts, IP, entity formation Q1 2027)

**Capital (Fall 2026 → Q1 2027):**
- **Bootstrap-viable path:** €0 external; pilot revenue funds ongoing costs
- **Accelerated path:** €300–500K friends-and-family or angel round for 12-month runway with growth budget (marketing, second hire, tooling)

**Partnerships:**
- Warm-intro relationships with 2–3 Stockholm VCs for portfolio access
- Design-system-first buyer (whiteboard-style consumer) as the first case study
- A named enterprise reference (if one of the pilots is a recognisable brand, that's the marketing multiplier)

**Legal / IP:**
- Swedish AB (Aktiebolag) as the entity
- IP assignment terms with contributors clear from day 1 (the "shared IP" model the user mentioned)
- Client contracts protecting the reusable-primitives ownership (we retain rights to what we brought in)
- Investor terms (if going the accelerated path): SAFE or convertible note over priced round for speed

**Instrumentation:**
- Ship-rate baseline methodology (agree on the metric per client before the embed)
- Case-study capture template (what to publish after each pilot)
- Ledger discipline (like today's session — every ruling and follow-up documented)

## 8. Brand and marketing

### Positioning

**One-liner:** _"We install the way modern product-tech teams should work."_

**Value promise (specific):** _"Your team ships 2× the product per quarter, and every new hire ramps in 2 weeks not 6, because the AI + process + review layer we install stays after we leave."_

**Anti-positioning:** we are not McKinsey. We are not Accenture. We are not another AI advisory. We are the people who show up, install a working system in 4 weeks, and go.

### Voice

- Technical, evidence-first, specific, no hype
- Publish real numbers, real code, real diffs
- Assume the reader is technical and busy
- Never say "unlock" or "leverage" or "AI-native transformation"

### Channels (first 6 months)

1. **LinkedIn — Jens's founder-voice.** 2–3 posts/week, mostly technical. Every post has a git link or a screenshot of a real ticket.
2. **Case studies as the marketing engine.** Every pilot → 1 published case study (with client permission). Story = the ship-rate delta with proof.
3. **Stockholm meetups + speaking.** 1–2 talks per quarter. Product-eng focused (not AI-hype events).
4. **Long-form technical writing.** 1–2 deep pieces per quarter under Manfred domain — foundation for Option C later.
5. **Warm intros over cold outreach.** Ratio target: 80/20.

### Brand architecture

Two live candidates:

- **A1: Sub-brand of Studio Manfred.** "Manfred Ops" or "Manfred Studio" — leverages Jens's existing brand equity, low setup cost, harder to spin out later if we go the Option B / investor route.
- **A2: New brand.** Cleaner story, easier fundraising, cleaner IP structure. Setup cost is real (naming, domain, logo, legal). Timing risk if we spend Q4 on branding instead of pilots.

**Working recommendation:** start under Manfred umbrella for the Fall 2026 pilots (fastest path to first case study); revisit rebrand at Q1 2027 entity formation.

### First 6-month plan

| Month | Action | Success signal |
|---|---|---|
| Oct 2026 | Ship 3 case-study posts based on existing Manfred work. Warm outreach to 20 prospects. | 5+ discovery calls booked |
| Nov 2026 | Sign 2 pilot letters (paid at ~50% target rate). Kick off pilot #1. | Pilot #1 live |
| Dec 2026 | Pilots #1 and #2 live. Publish first pilot case study. | First case study published |
| Jan 2027 | Convert pilot #1 to retainer at full rate. Form entity. Sign pilot #3. | First paid retainer |
| Feb 2027 | 2 paid retainers + 1 pilot. Second case study published. | Pipeline: 3 discovery calls/week |
| Mar 2027 | 3 retainers + 1 pilot. Hire the second operator. | Second-operator delivering solo |

If we're at 2 retainers + 3 published case studies by end of March 2027, we're on track. If we're at 0 retainers, we go back to research — the pitch didn't land and the market is telling us something.
