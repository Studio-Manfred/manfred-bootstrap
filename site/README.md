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
