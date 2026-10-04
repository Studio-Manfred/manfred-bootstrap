Colleague onboarding site for `manfred-bootstrap`.

## Run locally

```bash
GITHUB_TOKEN=$(gh auth token) npm --prefix site install && npm --prefix site run dev
```

## Build

```bash
npm --prefix site run build
```

## Deploy

Vercel builds this with Root Directory = `site`. Set the token for GitHub Packages with `vercel env add GITHUB_TOKEN production`.

## Update the plugin list

Edit `site/src/content/plugins.ts`.

## Add a new home section

Create `site/src/sections/<Name>.tsx` and export an `ANCHOR_ID` string from it. Then import the section in `site/src/routes/Home.tsx`, add `{ id: ANCHOR_ID, label: '...' }` to `ANCHOR_ITEMS`, and render it in order. The side nav and anchor links are built from `ANCHOR_ITEMS`, so you don't wire them by hand.

## Env vars

`GITHUB_TOKEN` is required at install time. The Manfred design system (`@studio-manfred/*`) lives on GitHub Packages, and `.npmrc` reads the token to authenticate. Locally, use `GITHUB_TOKEN=$(gh auth token)` (needs `read:packages`). In CI, the workflow passes it in. On Vercel, add it with `vercel env add GITHUB_TOKEN production`. The package also needs "Manage Actions access" granted to this repo.
