@AGENTS.md

# CLAUDE.md — {{PROJECT_NAME}}

Project-scoped guidance for Claude Code. `AGENTS.md` (imported above) carries the
operational rules — the rhythm, testing, a11y, knowledge. This file adds what is
specific to **{{PROJECT_NAME}}**.

## What this is
{{DESCRIPTION}}

## Linear
- Team prefix: `{{LINEAR_PREFIX}}` (tickets are `{{LINEAR_PREFIX}}-NNN`).
- The ticket exists before the branch. Branch: `feat/{{LINEAR_PREFIX}}-NNN-short-desc`.

## Project-specific conventions
<!-- Fill in as the project grows: data layer, routing, page layout, sharp edges. -->

## Sharp edges
<!-- Log gotchas here as you hit them; graduate recurring ones to knowledge/. -->

## Spinning up related Manfred projects
If you want to spin up a sibling Manfred project from this repo, or overlay
Manfred's way-of-working onto another repo on your machine, use these commands.

New sibling project:
```bash
curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh \
  | bash -s -- new --name <sibling> --prefix STU --dir ../<sibling> --yes
```

Overlay on another existing repo (non-destructive, existing files are kept):
```bash
cd /path/to/other-repo
curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh \
  | bash -s -- overlay --dir . --prefix <PREFIX>
```

Full options and examples: https://manfred-bootstrap-site.vercel.app
