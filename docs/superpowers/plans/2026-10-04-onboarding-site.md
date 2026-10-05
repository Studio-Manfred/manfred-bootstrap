# Onboarding Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Vite + React + TypeScript SPA at `/site/` inside `manfred-bootstrap` that walks a Manfred colleague from zero to a stamped project with Claude Code loaded with the right skills, in under 60 seconds for the happy path.

**Architecture:** Single scrolling home page (`/`) with eight anchored sections, plus one `/plugins` subpage listing all 11 `manfred-shared-knowledge` plugins. Reuses the `starter/` stack verbatim (Vite, React 19, TS strict, `@studio-manfred/manfred-design-system`, Vitest, Playwright, axe-playwright). Content ships at build time as TypeScript data; no backend, no CMS. Deploys to Vercel with Root Directory = `site`.

**Tech Stack:** Vite 6+, React 19, TypeScript 5+ (strict), `react-router-dom` v6, `@studio-manfred/manfred-design-system` (same version pin as `starter/`), `clsx`, `tailwind-merge`, Vitest + Testing Library, Playwright + `@axe-core/playwright`.

**Spec:** `docs/superpowers/specs/2026-10-04-onboarding-site-design.md`

## Global Constraints

- Node 20+ (match `starter/`).
- WCAG 2.2 AA on both routes in both themes; zero axe violations.
- One `<h1>` per page.
- English only; second-person voice.
- No bespoke tokens — only `@studio-manfred/manfred-design-system` tokens.
- `data-theme` attribute lives on `<html>`; three states: `light`, `dark`, `system`.
- Copy-success announcements use an `aria-live="polite"` region.
- Honour `prefers-reduced-motion` (disable, don't just shorten, animations).
- `.npmrc` reads `GITHUB_TOKEN` from env — identical to `starter/.npmrc`.
- All interactive elements keyboard-reachable with visible focus rings.
- Commits use conventional-commit prefixes and end with the attribution footer the harness supplies.
- Linear ticket: **STU-1035**. All PRs target this ticket; branch is `jens-wedin/stu-1035-onboarding-site`.

## Review Focus

Inputs or failure modes the spec implies that no task's tests exercise by default — each is pinned by a test in the owning task:

- **Clipboard API unavailable** (HTTP context, Firefox strict privacy, iframe without permission). Pinned in **Task 4** — `CommandBlock` falls back to selecting the text and renders a "Press Cmd/Ctrl+C" hint instead of silently failing.
- **`localStorage` throws** (Safari private mode, strict site settings). Pinned in **Task 3** — `ThemeToggle` catches the throw, keeps the current theme in memory for the session, and still renders.
- **Keyboard-only navigation** (no mouse). Pinned in **Task 5** (`PathTabs` arrow-key nav) and **Task 3** (`ThemeToggle` Enter/Space).
- **`prefers-reduced-motion: reduce`** (OS accessibility setting). Pinned in **Task 3** — theme transition is skipped (not shortened).
- **First visit with `prefers-color-scheme: dark`** (OS in dark mode, no stored pref). Pinned in **Task 3** — `data-theme` matches the OS preference on first render.

---

### Task 1: Scaffold the `/site/` project

**Files:**
- Create: `site/package.json`, `site/vite.config.ts`, `site/tsconfig.json`, `site/tsconfig.node.json`, `site/.npmrc`, `site/index.html`, `site/src/main.tsx`, `site/src/App.tsx`, `site/.gitignore`, `site/.eslintrc` (or `eslint.config.js` matching `starter/`), `site/vitest.config.ts`
- Reference (read, do not modify): `starter/package.json`, `starter/.npmrc`, `starter/vite.config.ts`, `starter/tsconfig.json`, `starter/vitest.config.ts`, `starter/eslint.config.js`
- Test: `site/test/smoke.test.tsx`

**Interfaces:**
- Produces: a buildable Vite + React + TS project rooted at `site/`. `App` is the top-level component; `main.tsx` mounts it. React Router is **not** wired yet (that's Task 2).

- [ ] **Step 1: Write the failing test**

```tsx
// site/test/smoke.test.tsx
import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

test('App renders a landmark', () => {
  render(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `cd site && pnpm vitest run test/smoke.test.tsx`
Expected: FAIL (`App` not found or no `<main>` element).

- [ ] **Step 3: Scaffold the project**

Create `package.json` with scripts mirroring `starter/package.json`: `dev`, `build`, `preview`, `lint`, `typecheck`, `test`, `test:run`, `test:coverage`, `test:e2e`. Dependencies: `react@^19`, `react-dom@^19`, `@studio-manfred/manfred-design-system` (match starter's version), `clsx`, `tailwind-merge`. Dev deps: the exact subset starter uses (TypeScript, Vite, Vitest, Testing Library, ESLint config).

Create `.npmrc` identical to `starter/.npmrc`.

Create `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `eslint.config.js` by copying the shape from `starter/` and adjusting paths.

Create `index.html` with `<html lang="en">`, viewport meta, and `<div id="root">`.

Create `src/main.tsx` that mounts `App` into `#root`. Create `src/App.tsx` exporting a `App` function component that returns `<main>Site under construction</main>`.

Create `vitest.config.ts` matching `starter/vitest.config.ts` (jsdom env, setupFiles, path aliases).

- [ ] **Step 4: Install deps and run the test**

Run: `cd site && pnpm install && pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Verify dev server and build**

Run: `cd site && pnpm build`
Expected: build succeeds, no TypeScript errors.
Run: `cd site && pnpm dev` → open `http://localhost:5173` → see "Site under construction" → stop server.

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "feat(site): scaffold Vite + React + TS project (STU-1035)"
```

---

### Task 2: Routing shell + layout landmarks

**Files:**
- Modify: `site/package.json` (add `react-router-dom@^6`), `site/src/App.tsx`
- Create: `site/src/routes/Home.tsx`, `site/src/routes/Plugins.tsx`, `site/src/components/SkipToContent.tsx`
- Test: `site/test/routing.test.tsx`, `site/test/skip-to-content.test.tsx`

**Interfaces:**
- Consumes: `App` from Task 1.
- Produces:
  - `App` wraps the tree in `BrowserRouter` and renders routes `/` → `Home`, `/plugins` → `Plugins`.
  - `Home` and `Plugins` each render a `<main id="main">` with a unique `<h1>` ("Manfred bootstrap" on `/`, "Plugins" on `/plugins`).
  - `SkipToContent`: `() => JSX.Element` — a visually hidden link that becomes visible on focus and jumps to `#main`.

- [ ] **Step 1: Write the failing tests**

```tsx
// site/test/routing.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

test('renders Home at /', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1, name: /manfred bootstrap/i })).toBeInTheDocument();
});

test('renders Plugins at /plugins', () => {
  render(<MemoryRouter initialEntries={['/plugins']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { level: 1, name: /plugins/i })).toBeInTheDocument();
});
```

```tsx
// site/test/skip-to-content.test.tsx
import { render, screen } from '@testing-library/react';
import { SkipToContent } from '../src/components/SkipToContent';

test('SkipToContent renders a link to #main', () => {
  render(<SkipToContent />);
  const link = screen.getByRole('link', { name: /skip to content/i });
  expect(link).toHaveAttribute('href', '#main');
});
```

- [ ] **Step 2: Confirm both fail**

Run: `pnpm test:run`
Expected: both fail.

- [ ] **Step 3: Implement**

Install `react-router-dom`. Make `App` render `<BrowserRouter>` wrapping `<SkipToContent />` and `<Routes>`. Implement `Home` and `Plugins` with `<main id="main">`, `<h1>`, and an empty placeholder. `SkipToContent` renders a DS link styled as sr-only until focused.

- [ ] **Step 4: Confirm both pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add routing, Home/Plugins routes, skip-to-content (STU-1035)"
```

---

### Task 3: Theme system

**Files:**
- Create: `site/src/components/ThemeToggle.tsx`, `site/src/lib/theme.ts`
- Modify: `site/src/App.tsx` (mount `ThemeToggle` once, call `applyStoredTheme()` on mount)
- Test: `site/test/theme-toggle.test.tsx`, `site/test/theme-lib.test.ts`

**Interfaces:**
- Consumes: nothing beyond standard DOM / React.
- Produces:
  - `theme.ts` exports: `type Theme = 'light' | 'dark' | 'system'`; `readStoredTheme(): Theme` (returns `'system'` if `localStorage` throws or value is missing/invalid); `writeStoredTheme(t: Theme): void` (silently no-ops if `localStorage` throws); `applyTheme(t: Theme): void` (sets `data-theme` on `<html>` to `light`/`dark`, derived from `prefers-color-scheme` when `t === 'system'`); `nextTheme(t: Theme): Theme` (cycles `light → dark → system → light`).
  - `<ThemeToggle />`: self-contained, renders a button whose `aria-label` names the next state; cycling updates `data-theme`, persists, and is Enter/Space-activatable.

- [ ] **Step 1: Write the failing tests**

```ts
// site/test/theme-lib.test.ts
import { readStoredTheme, writeStoredTheme, nextTheme, applyTheme } from '../src/lib/theme';

test('readStoredTheme returns system when storage throws', () => {
  const orig = Storage.prototype.getItem;
  Storage.prototype.getItem = () => { throw new Error('blocked'); };
  expect(readStoredTheme()).toBe('system');
  Storage.prototype.getItem = orig;
});

test('writeStoredTheme does not throw when storage throws', () => {
  const orig = Storage.prototype.setItem;
  Storage.prototype.setItem = () => { throw new Error('blocked'); };
  expect(() => writeStoredTheme('dark')).not.toThrow();
  Storage.prototype.setItem = orig;
});

test('nextTheme cycles light → dark → system → light', () => {
  expect(nextTheme('light')).toBe('dark');
  expect(nextTheme('dark')).toBe('system');
  expect(nextTheme('system')).toBe('light');
});

test('applyTheme sets data-theme to OS pref when system and OS is dark', () => {
  const mql = { matches: true } as MediaQueryList;
  window.matchMedia = () => mql as MediaQueryList;
  applyTheme('system');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});
```

```tsx
// site/test/theme-toggle.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../src/components/ThemeToggle';

test('clicking cycles theme and updates data-theme', async () => {
  render(<ThemeToggle />);
  const btn = screen.getByRole('button');
  await userEvent.click(btn);
  // From initial system → light (nextTheme), applied; verify data-theme is 'light'
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('Enter and Space activate the toggle', async () => {
  render(<ThemeToggle />);
  const btn = screen.getByRole('button');
  btn.focus();
  await userEvent.keyboard('{Enter}');
  expect(document.documentElement.hasAttribute('data-theme')).toBe(true);
});

test('reduced motion disables transition class', () => {
  window.matchMedia = (q: string) => ({ matches: q.includes('reduced'), addEventListener: () => {}, removeEventListener: () => {} }) as unknown as MediaQueryList;
  render(<ThemeToggle />);
  expect(document.documentElement).not.toHaveClass('theme-transition');
});
```

- [ ] **Step 2: Confirm the tests fail**

Run: `pnpm test:run`
Expected: all four fail.

- [ ] **Step 3: Implement `theme.ts` and `ThemeToggle`**

`theme.ts` wraps every `localStorage` access in `try/catch`. `applyTheme('system')` reads `window.matchMedia('(prefers-color-scheme: dark)').matches`.

`ThemeToggle` initialises state from `readStoredTheme()` on mount, applies it, and listens for `prefers-color-scheme` changes while in `system` mode. On click, it computes `nextTheme`, writes, and applies. Guards transition-class application with `prefers-reduced-motion`.

- [ ] **Step 4: Confirm all pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Mount in App**

Add `<ThemeToggle />` to `App` (visible on both routes). Call `applyTheme(readStoredTheme())` from `main.tsx` before React mounts, so there is no flash of wrong theme.

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "feat(site): add theme toggle with localStorage + prefers-color-scheme (STU-1035)"
```

---

### Task 4: `CommandBlock` component

**Files:**
- Create: `site/src/components/CommandBlock.tsx`
- Test: `site/test/command-block.test.tsx`

**Interfaces:**
- Produces: `<CommandBlock command: string, label?: string />`. Renders the command in a monospace block with a Copy button. On click, writes `command` to `navigator.clipboard`; if that throws or is undefined, selects the command text and renders a "Press Cmd/Ctrl+C" fallback hint. Announces "Copied" via a visually hidden `aria-live="polite"` region. "Copied" state reverts to idle after 2000 ms.

- [ ] **Step 1: Write the failing tests**

```tsx
// site/test/command-block.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandBlock } from '../src/components/CommandBlock';

test('clicking copies command to clipboard and announces', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.assign(navigator, { clipboard: { writeText } });
  render(<CommandBlock command="npm run dev" />);
  await userEvent.click(screen.getByRole('button', { name: /copy/i }));
  expect(writeText).toHaveBeenCalledWith('npm run dev');
  expect(await screen.findByText(/copied/i)).toBeInTheDocument();
});

test('copied state reverts after 2000ms', async () => {
  vi.useFakeTimers();
  Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  render(<CommandBlock command="x" />);
  await userEvent.click(screen.getByRole('button', { name: /copy/i }));
  vi.advanceTimersByTime(2000);
  await waitFor(() => expect(screen.queryByText(/copied/i)).not.toBeInTheDocument());
  vi.useRealTimers();
});

test('shows fallback hint when clipboard API throws', async () => {
  Object.assign(navigator, { clipboard: { writeText: () => Promise.reject(new Error('nope')) } });
  render(<CommandBlock command="x" />);
  await userEvent.click(screen.getByRole('button', { name: /copy/i }));
  expect(await screen.findByText(/cmd\/ctrl\+c/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm all fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement `CommandBlock`**

Button triggers `navigator.clipboard?.writeText(command)`. On success, set state to `"copied"`, start a 2000 ms timeout to revert. On failure (reject or `clipboard` undefined), select the command text node (`window.getSelection`) and set state to `"fallback"` which renders the hint. The announcement node is a visually hidden `<span aria-live="polite" aria-atomic="true">` that only contains text in `copied` state.

- [ ] **Step 4: Confirm all pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add CommandBlock with clipboard fallback (STU-1035)"
```

---

### Task 5: `PathTabs` component

**Files:**
- Create: `site/src/components/PathTabs.tsx`
- Test: `site/test/path-tabs.test.tsx`

**Interfaces:**
- Produces: `<PathTabs />` renders two tabs — "New project" (value `new`) and "Existing project" (value `existing`). Current value is derived from `window.location.hash` (`#new` or `#existing`, defaulting to `new`). Selecting a tab updates the hash. Arrow Left/Right cycle focus and selection among the tabs. Each tab's panel renders `children` conditionally (consumers pass two children keyed to the values).
- Signature: `PathTabs({ panels: { new: ReactNode; existing: ReactNode } }): JSX.Element`.

- [ ] **Step 1: Write the failing tests**

```tsx
// site/test/path-tabs.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PathTabs } from '../src/components/PathTabs';

test('selecting Existing updates URL hash to #existing', async () => {
  render(<PathTabs panels={{ new: <div>N</div>, existing: <div>E</div> }} />);
  await userEvent.click(screen.getByRole('tab', { name: /existing/i }));
  expect(window.location.hash).toBe('#existing');
  expect(screen.getByText('E')).toBeVisible();
});

test('ArrowRight moves focus and selection to next tab', async () => {
  render(<PathTabs panels={{ new: <div>N</div>, existing: <div>E</div> }} />);
  const newTab = screen.getByRole('tab', { name: /new project/i });
  newTab.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: /existing/i })).toHaveFocus();
});
```

- [ ] **Step 2: Confirm both fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement `PathTabs`**

Use the DS `Tabs` primitive if it exists; otherwise compose a WAI-ARIA tablist with `role="tab"` / `role="tabpanel"` and `aria-selected`. Sync state with `window.location.hash` via a `useEffect` that listens for `hashchange`.

- [ ] **Step 4: Confirm both pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add PathTabs with URL hash sync + keyboard nav (STU-1035)"
```

---

### Task 6: `AnchorNav` component

**Files:**
- Create: `site/src/components/AnchorNav.tsx`
- Test: `site/test/anchor-nav.test.tsx`

**Interfaces:**
- Produces: `<AnchorNav items={{ id: string; label: string }[]} />`. Renders a sticky `<nav aria-label="On this page">` with one `<a href={`#${id}`}>` per item. Uses `IntersectionObserver` to mark the currently visible section's link with `aria-current="location"`.

- [ ] **Step 1: Write the failing tests**

```tsx
// site/test/anchor-nav.test.tsx
import { render, screen } from '@testing-library/react';
import { AnchorNav } from '../src/components/AnchorNav';

test('renders one link per item', () => {
  render(<AnchorNav items={[{ id: 'why', label: 'Why' }, { id: 'when', label: 'When' }]} />);
  expect(screen.getByRole('link', { name: 'Why' })).toHaveAttribute('href', '#why');
  expect(screen.getByRole('link', { name: 'When' })).toHaveAttribute('href', '#when');
});

test('nav has accessible name', () => {
  render(<AnchorNav items={[]} />);
  expect(screen.getByRole('navigation', { name: /on this page/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm both fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement `AnchorNav`**

Observe section elements by `id` with `IntersectionObserver`; the entry with the greatest `intersectionRatio` wins and its link receives `aria-current="location"`. Fall back to the first item if the observer isn't supported.

- [ ] **Step 4: Confirm both pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add AnchorNav with intersection-observer active state (STU-1035)"
```

---

### Task 7: Plugins data

**Files:**
- Create: `site/src/content/plugins.ts`
- Test: `site/test/plugins-data.test.ts`

**Interfaces:**
- Produces: `type Plugin = { slug: string; pitch: string; skills: number; commands: number; group: 'design' | 'engineering' | 'knowledge' }`; `const PLUGINS: Plugin[]` with exactly 11 entries matching the `manfred-shared-knowledge` README.

- [ ] **Step 1: Write the failing test**

```ts
// site/test/plugins-data.test.ts
import { PLUGINS } from '../src/content/plugins';

test('has exactly 11 plugins', () => {
  expect(PLUGINS).toHaveLength(11);
});

test('includes all expected slugs', () => {
  const slugs = PLUGINS.map(p => p.slug).sort();
  expect(slugs).toEqual([
    'manfred-design-ops', 'manfred-design-research', 'manfred-design-systems',
    'manfred-dev', 'manfred-discovery', 'manfred-interaction-design',
    'manfred-knowledge', 'manfred-prototyping-testing', 'manfred-toolkit',
    'manfred-ui-design', 'manfred-ux-strategy',
  ]);
});

test('every plugin has pitch, skills count, commands count, group', () => {
  for (const p of PLUGINS) {
    expect(p.pitch.length).toBeGreaterThan(0);
    expect(p.skills).toBeGreaterThan(0);
    expect(['design', 'engineering', 'knowledge']).toContain(p.group);
  }
});
```

- [ ] **Step 2: Confirm the tests fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Populate `plugins.ts`**

Transcribe the 11 plugins from the `manfred-shared-knowledge` README (counts: `discovery` 7 skills / 3 commands, `design-research` 11/4, `ux-strategy` 8/3, `design-systems` 10/3, `ui-design` 9/4, `interaction-design` 7/3, `prototyping-testing` 8/4, `design-ops` 7/3, `toolkit` 10/3, `dev` 3/0, `knowledge` 3/0). Groups: `dev` → `engineering`, `knowledge` → `knowledge`, rest → `design`.

- [ ] **Step 4: Confirm all pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add typed plugin catalogue (STU-1035)"
```

---

### Task 8: `PluginCard` component + `/plugins` route

**Files:**
- Create: `site/src/components/PluginCard.tsx`
- Modify: `site/src/routes/Plugins.tsx`
- Test: `site/test/plugin-card.test.tsx`, `site/test/plugins-route.test.tsx`

**Interfaces:**
- Consumes: `PLUGINS` from Task 7; `CommandBlock` from Task 4.
- Produces:
  - `<PluginCard plugin={Plugin} />`: renders the slug, pitch, skill/command counts, and a `CommandBlock` with `` `/plugin install ${plugin.slug}@manfred` ``.
  - `Plugins` route renders three sections (Design / Engineering / Knowledge), each a `<section aria-labelledby>` wrapping the matching cards in a grid.

- [ ] **Step 1: Write the failing tests**

```tsx
// site/test/plugin-card.test.tsx
import { render, screen } from '@testing-library/react';
import { PluginCard } from '../src/components/PluginCard';

test('renders slug, pitch, counts, and install command', () => {
  render(<PluginCard plugin={{ slug: 'manfred-dev', pitch: 'Pre-merge QA + deploy', skills: 3, commands: 0, group: 'engineering' }} />);
  expect(screen.getByText('manfred-dev')).toBeInTheDocument();
  expect(screen.getByText(/pre-merge QA/i)).toBeInTheDocument();
  expect(screen.getByText(/3 skills/i)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { hidden: true })).toHaveValue('/plugin install manfred-dev@manfred');
});
```

```tsx
// site/test/plugins-route.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

test('renders all 11 plugin cards grouped by discipline', () => {
  render(<MemoryRouter initialEntries={['/plugins']}><App /></MemoryRouter>);
  expect(screen.getAllByTestId('plugin-card')).toHaveLength(11);
  expect(screen.getByRole('region', { name: /design/i })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: /engineering/i })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: /knowledge/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm both fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement `PluginCard` + `Plugins`**

Card is a DS `Card` with heading, pitch, badge pair for counts, and a nested `CommandBlock`. `Plugins` filters `PLUGINS` into the three groups and renders a labelled section per group.

- [ ] **Step 4: Confirm both pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add PluginCard + /plugins route (STU-1035)"
```

---

### Task 9: Home — Hero, Why, WhenToUse, QuickStart sections

**Files:**
- Create: `site/src/sections/Hero.tsx`, `site/src/sections/Why.tsx`, `site/src/sections/WhenToUse.tsx`, `site/src/sections/QuickStart.tsx`
- Modify: `site/src/routes/Home.tsx` (compose first four sections + `AnchorNav`)
- Test: `site/test/home-top.test.tsx`

**Interfaces:**
- Consumes: `CommandBlock` (Task 4), `AnchorNav` (Task 6).
- Produces: four section components, each exporting a default function and a named `anchorId` constant. `Home` composes them in order and feeds the anchor ids into `AnchorNav`.

Content (verbatim strings the implementer uses):

- Hero `h1`: "Manfred bootstrap". Lede: "Stamp a Manfred project, hand it to Claude, and start shipping." Two CTAs (DS buttons): "Start a new project" (`href="#new"`) and "Add to an existing repo" (`href="#existing"`).
- Why section — anchor `why`, `h2` "Why this exists". Bullets (exact copy):
  - "Ship faster with Claude Code already configured — eight role-based agents, superpowers workflow, Linear-anchored branches."
  - "Design-system first. The `designer` agent checks the DS before building UI."
  - "CI, Playwright E2E, axe accessibility checks, and a coverage ratchet from day one."
  - "Linear-prefixed branches auto-close tickets on merge."
  - "Same way-of-working across every Manfred project."
- WhenToUse — anchor `when`, `h2` "When to use it". Prose:
  - "**Use it when:** you're starting a new Manfred project, or adding the way-of-working to an existing repo that's missing it."
  - "**Don't use it when:** you're working inside a client-owned repo (unless they've cleared it) or hacking on a one-week throwaway prototype."
- QuickStart — anchor `start`, `h2` "Quick start". Prereqs line: "Node 20+, `gh` authenticated, Claude Code CLI installed." Single `CommandBlock`:
  `node scripts/bootstrap.mjs new --name <project> --prefix STU --dir ../<project>`
  Then one line: "Open the new directory in Claude Code and tell it to read `docs/ways-of-working-overview.md`." Link down to `#new` for the full flow.

- [ ] **Step 1: Write the failing test**

```tsx
// site/test/home-top.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

test('Home renders Hero / Why / WhenToUse / QuickStart sections in order', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  const h2s = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
  expect(h2s.slice(0, 3)).toEqual(['Why this exists', 'When to use it', 'Quick start']);
});

test('Hero CTAs link to #new and #existing', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByRole('link', { name: /start a new project/i })).toHaveAttribute('href', '#new');
  expect(screen.getByRole('link', { name: /add to an existing repo/i })).toHaveAttribute('href', '#existing');
});
```

- [ ] **Step 2: Confirm both fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement the four sections and wire into `Home`**

Each section is a `<section id={anchorId} aria-labelledby={headingId}>` with the content above. `Home` renders `<AnchorNav>` + the four sections in order.

- [ ] **Step 4: Confirm all pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add Hero / Why / WhenToUse / QuickStart sections (STU-1035)"
```

---

### Task 10: Home — NewProject, ExistingProject, ClaudeSetup, NextSteps sections

**Files:**
- Create: `site/src/sections/NewProject.tsx`, `site/src/sections/ExistingProject.tsx`, `site/src/sections/ClaudeSetup.tsx`, `site/src/sections/NextSteps.tsx`
- Modify: `site/src/routes/Home.tsx` (append the four sections; `PathTabs` wraps `NewProject` + `ExistingProject`)
- Test: `site/test/home-bottom.test.tsx`

**Interfaces:**
- Consumes: `CommandBlock` (Task 4), `PathTabs` (Task 5).
- Produces: four section components.

Content (verbatim):

- NewProject — anchor `new`, `h2` "Path A — New project". `CommandBlock`:
  `node scripts/bootstrap.mjs new --name <project> --prefix STU --dir ../<project> --github --vercel --linear --linear-team STU --yes`
  Table (DS table) of flags: `--github` provisions the GitHub repo; `--vercel` provisions the Vercel project; `--linear` creates the Linear team; `--yes` auto-approves. "What ships" bullets: CI, Playwright, axe, DS, 8 agents.
- ExistingProject — anchor `existing`, `h2` "Path B — Existing project". `CommandBlock`:
  `node scripts/bootstrap.mjs overlay --dir ../existing-repo --prefix STU`
  Note: "Non-destructive. Only files declared in `overlay.manifest.json` are copied; existing files are never overwritten." Pointer to `overlay.manifest.json` at the repo root. "Resolve conflicts yourself" line.
- Both NewProject and ExistingProject are rendered inside a single `PathTabs` so they share the `#new`/`#existing` hash.
- ClaudeSetup — anchor `claude`, `h2` "Give Claude superpowers". Two `CommandBlock`s:
  `/plugin marketplace add Studio-Manfred/manfred-shared-knowledge`
  `/plugin install manfred-dev@manfred`
  Prose: "Pick the plugins you need from the full list below." CTA link to `/plugins`. Optional home-install `CommandBlock`:
  `curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-shared-knowledge/main/install.sh | bash`
- NextSteps — anchor `next`, `h2` "Next steps". Bullets:
  - "Open the Studio Manfred Linear workspace and create your first ticket (prefix `STU-`)."
  - "Read `docs/ways-of-working-overview.md` and `docs/superpowers-workflow.md`."
  - "Keep a project `MEMORY.md` for session handoffs."
  - "Need help? Post in Slack `#tech-help`."

- [ ] **Step 1: Write the failing test**

```tsx
// site/test/home-bottom.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../src/App';

test('Home renders the four lower sections in order', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  const h2s = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
  expect(h2s.slice(-4)).toEqual([
    'Path A — New project',
    'Path B — Existing project',
    'Give Claude superpowers',
    'Next steps',
  ]);
});

test('NewProject + ExistingProject share a single tablist', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map(t => t.textContent)).toEqual(['New project', 'Existing project']);
});

test('NextSteps mentions #tech-help', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByText(/#tech-help/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Confirm all fail**

Run: `pnpm test:run`
Expected: FAIL.

- [ ] **Step 3: Implement the four sections and wire into `Home`**

Keep NewProject / ExistingProject as pure content components; `Home` wraps them in a single `PathTabs`. The `h2`s for those two live inside the tab panels so there's always one visible.

- [ ] **Step 4: Confirm all pass**

Run: `pnpm test:run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "feat(site): add NewProject / ExistingProject / ClaudeSetup / NextSteps sections (STU-1035)"
```

---

### Task 11: Playwright E2E + axe-playwright

**Files:**
- Create: `site/playwright.config.ts`, `site/e2e/golden-path.spec.ts`, `site/e2e/axe.spec.ts`
- Modify: `site/package.json` (add `@playwright/test`, `@axe-core/playwright`; add `test:e2e` script if missing)
- Reference: `starter/playwright.config.ts`

**Interfaces:**
- Consumes: all previous tasks.
- Produces: two Playwright specs that run against `pnpm dev` or `pnpm preview`. Golden path exercises hero → existing tab → copy → navigate to `/plugins` → copy a plugin install. `axe.spec.ts` scans `/` and `/plugins` in both themes.

- [ ] **Step 1: Write the failing specs**

```ts
// site/e2e/golden-path.spec.ts
import { test, expect } from '@playwright/test';

test('golden path: hero → existing → copy → plugins → copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /manfred bootstrap/i })).toBeVisible();
  await page.getByRole('link', { name: /add to an existing repo/i }).click();
  await expect(page).toHaveURL(/#existing$/);
  await page.getByRole('tab', { name: /existing project/i }).click();
  await page.getByRole('button', { name: /copy/i }).first().click();
  await expect(page.getByText(/copied/i).first()).toBeVisible();
  await page.goto('/plugins');
  await expect(page.getByTestId('plugin-card')).toHaveCount(11);
});
```

```ts
// site/e2e/axe.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['/', '/plugins']) {
  for (const theme of ['light', 'dark']) {
    test(`axe clean on ${route} in ${theme}`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
```

- [ ] **Step 2: Confirm the specs fail (or the config is missing)**

Run: `cd site && pnpm test:e2e`
Expected: FAIL (no config / no server).

- [ ] **Step 3: Add the Playwright config**

`playwright.config.ts` mirrors `starter/playwright.config.ts` but points `webServer` to `pnpm preview --port 4173` and `baseURL` to `http://localhost:4173`. Reporter: `list`.

- [ ] **Step 4: Confirm the specs pass**

Run: `cd site && pnpm build && pnpm test:e2e`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "test(site): Playwright golden-path + axe-playwright (STU-1035)"
```

---

### Task 12: CI job + Vercel deploy config

**Files:**
- Create: `.github/workflows/site.yml`, `site/vercel.json`, `site/README.md` (minimal), `site/CHANGELOG.md`
- Reference: `.github/workflows/*.yml` for the current workflow shape (if any), `starter/vercel.json`

**Interfaces:**
- Consumes: Tasks 1–11 complete.
- Produces: CI job named `site` triggered by changes under `site/**`; runs install, typecheck, lint, test, build, e2e, axe. Vercel JSON tells Vercel to build from `site/`.

- [ ] **Step 1: Draft the workflow**

Workflow steps: checkout → setup Node 20 → setup pnpm → install (with `env: GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`) → `pnpm --dir site typecheck` → `pnpm --dir site lint` → `pnpm --dir site test:run` → `pnpm --dir site build` → `pnpm --dir site exec playwright install --with-deps chromium` → `pnpm --dir site test:e2e`.

- [ ] **Step 2: Verify locally**

Run: `act -j site` (if `act` is installed) OR push a draft branch and verify the Actions tab. For local-only verification, run the workflow's shell steps manually.

- [ ] **Step 3: Draft `site/vercel.json`**

```json
{
  "buildCommand": "pnpm --dir .. install && pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

Document in `site/README.md` the Vercel setup commands:
```
vercel link
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_TOKEN preview
```

- [ ] **Step 4: Confirm the workflow lints**

Run: `pnpm dlx action-validator .github/workflows/site.yml` (or similar). Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/site.yml site/vercel.json site/README.md site/CHANGELOG.md
git commit -m "ci(site): add site workflow + Vercel config (STU-1035)"
```

---

### Task 13: Documentation + MEMORY

**Files:**
- Modify: `README.md` (root), `CHANGELOG.md` (root), `MEMORY.md`
- Modify: `site/README.md` (expand from Task 12 minimum)

**Interfaces:**
- Consumes: everything.
- Produces: colleagues can find and run the site from the repo root.

- [ ] **Step 1: Update root README**

Insert near the top (right after the overview paragraph):

```
> **New here?** Start at the onboarding site: <PROD_URL>. It walks you through `new`, `overlay`, and installing the shared-knowledge plugins.
```

Replace `<PROD_URL>` with the real Vercel URL once Task 12 produces one.

- [ ] **Step 2: Update root CHANGELOG**

Add an `Unreleased` entry: "Added: onboarding site at `/site/` (STU-1035)."

- [ ] **Step 3: Update MEMORY**

Append a session-close entry naming the site, the Vercel URL, the Linear ticket, and the file to edit for the plugin list (`site/src/content/plugins.ts`).

- [ ] **Step 4: Expand `site/README.md`**

Sections: Purpose, Run locally, Build, Env vars (`GITHUB_TOKEN`), Deploy (Vercel), How to update the plugin list, How to add a new home section.

- [ ] **Step 5: Commit**

```bash
git add README.md CHANGELOG.md MEMORY.md site/README.md
git commit -m "docs(site): link site from root README, log in CHANGELOG + MEMORY (STU-1035)"
```

- [ ] **Step 6: Open the PR**

Open a PR to `main` from `jens-wedin/stu-1035-onboarding-site`. Title: `feat(site): onboarding site for colleagues (STU-1035)`. Body references the spec and this plan.

---

## Scope Check

This plan covers one subsystem — the onboarding site. It depends on nothing else being changed in `manfred-bootstrap`. It does not change `starter/`, `scripts/`, `overlay.manifest.json`, or the WoW docs. It does not change `manfred-shared-knowledge` — it only reads the public plugin list and transcribes it.

## Self-Review notes

- **Spec coverage.** Every spec section maps to tasks: §5 → Task 1, §5.2 folder → Tasks 1–10, §5.3 deploy → Task 12, §5.4 theming → Task 3, §6 home sections → Tasks 9–10, §6 /plugins → Tasks 7–8, §7 components → Tasks 3–6 & 8, §8 a11y → Tasks 2, 3, 4, 11, §9 testing → each task plus Task 11, §10 CI → Task 12, §11 docs → Task 13, §12 non-goals → nothing to implement, §13 risks → Task 1 (GITHUB_TOKEN docs in README), Task 7 (snapshot test), Task 11 (axe), Task 12 (Vercel env).
- **Review Focus.** All five failure modes have an owning task and a specific test above.
- **Type consistency.** `Plugin` shape in Task 7 matches `PluginCard` prop in Task 8. `Theme` type in Task 3 is self-contained. `PathTabs` panel keys (`new`, `existing`) match the hash values Tasks 9–10 depend on.
- **Proportion.** Plan is longer than the spec but mostly test code and verbatim content strings the implementer needs — no function bodies except those pinned by shape.
