# Handoff — manual setup receipts

Everything listed here is already done. Kept as a receipt so new maintainers can see the sequence that led to the live state. Open an issue if any step regresses.

---

## 1. GitHub remote + initial push — ✓ Done

Repo is `Studio-Manfred/manfred-bootstrap` (public since 2026-10-05, needed for the `install.sh` curl one-liner to resolve).

---

## 2. Mark as a Template repository — TODO (verify in Settings → General → Template repository)

Cannot be verified from the repo contents alone. The controller should check that **Template repository** is ticked; it is what makes the "Use this template" button appear for consumers.

---

## 3. GitHub Packages access for CI — ✓ Done

Marketplace package `@studio-manfred/manfred-design-system` is readable by `manfred-bootstrap`'s Actions runs (granted 2026-10-05 via org Packages → Manage Actions access). First successful CI run is in Actions history.

---

## 4. Vercel project — ✓ Done

`manfred-bootstrap-site` on Vercel, Root Directory = `site`, `GITHUB_TOKEN` set for production + preview, Git integration auto-deploys on push to main. Live at https://manfred-bootstrap-site.vercel.app.
