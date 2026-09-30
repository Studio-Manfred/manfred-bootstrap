# Presentations

HTML slide decks built with [reveal.js](https://revealjs.com). Every deck is a single self-contained HTML file with CDN-loaded dependencies — no build step, no npm install, no Node required.

## What's here

| File | About | For |
|---|---|---|
| `venture-2026-seventyone-group.html` | 24-slide venture-scoping deck for the SeventyOne Group founders discussion (Sept 2026) | David + Håkan (SeventyOne), Moa (Mather), Jens (Manfred) |
| `process-map.html` | Existing map of the Manfred process flow | Internal + client-facing |

More decks land here over time — each named `<topic>-<yyyy>.html` or `<topic>-<yyyy-context>.html`.

## Viewing locally

Any modern browser. From this directory:

```bash
open venture-2026-seventyone-group.html
# or
python3 -m http.server 8000   # then visit http://localhost:8000/venture-2026-seventyone-group.html
```

The `open` form works for reveal.js because everything (fonts, JS, CSS) loads from CDN — no local server needed for a first read. The server form is only needed if you want the fragment/hash URL routing to feel snappy.

## Presenter shortcuts (reveal.js)

- **Space / →** — next slide
- **← / ↑** — previous slide
- **S** — open speaker view in a new window (speaker notes visible)
- **F** — full screen
- **Esc / O** — slide overview grid
- **B** — pause / black-out screen
- **?** — help overlay (all shortcuts)

## Print / PDF export

Add `?print-pdf` to the URL, then use the browser's print dialog with **Background graphics** enabled:

```
open "venture-2026-seventyone-group.html?print-pdf"
```

Save as PDF from the print dialog. Reveal.js re-flows content for print automatically.

## Sharing via GitHub Pages

Every file in `presentations/` becomes web-accessible when GitHub Pages is enabled for the `manfred-bootstrap` repository.

### One-time setup (repo owner)

1. Push this branch (or its merged version) to `main`
2. GitHub → repo → **Settings** → **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main`
5. **Folder:** `/ (root)`
6. Click **Save**. Pages will build and publish within ~1 minute.

### Sharing links

Once Pages is live, decks are shareable via:

```
https://studio-manfred.github.io/manfred-bootstrap/presentations/venture-2026-seventyone-group.html
```

**Deep-link a specific slide** using the URL hash — every slide has one:

```
https://studio-manfred.github.io/manfred-bootstrap/presentations/venture-2026-seventyone-group.html#/13
```

(slide 13 is the Q4 experiments slate)

### If you don't want the whole repo on Pages

Alternative: create a `gh-pages` branch containing only the `presentations/` folder. GitHub Pages can be pointed at that branch instead — nothing else is exposed. Ping if you want a one-time script that keeps `gh-pages` in sync with `main/presentations/` on every push.

## Authoring conventions

- **One deck per HTML file.** Self-contained; CDN dependencies only.
- **Fonts** — Google Fonts (Space Grotesk, Inter, JetBrains Mono).
- **Custom theme** — inline `<style>` block at the top of each deck. No shared external CSS (keeps decks portable when a stakeholder saves a link and opens it later).
- **Speaker notes** — always in `<aside class="notes">…</aside>` inside each `<section>`. Access via `S` in the browser.
- **Brand colours** — CSS variables per firm:
  - `--manfred` — Studio Manfred (Business Blue lineage)
  - `--seventyone` — SeventyOne Consulting (indigo, distinct hue)
  - `--mather` — Mather Studio (warm amber)
  - `--venture` — the fourth firm / unnamed accent (electric green)
- **Cards + chips** — reusable `.card`, `.card--<brand>`, `.chip`, `.chip--<brand>` classes.
- **Data slides** — inline SVG or CSS bar-rows. No chart libraries; keeps size down.

## Licence

Content: internal Manfred material unless otherwise noted per deck.
reveal.js: MIT.
