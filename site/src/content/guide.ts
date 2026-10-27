// Single source for the guide text. The page sections and the Markdown snapshot
// (src/lib/guide-context.ts) both read from here, so they cannot drift apart.
// Strings may contain `inline code` spans; <Inline> renders them, the snapshot keeps them as Markdown.
import { CLONE_PREFIX, INSTALL_URL } from '../lib/install'

export const SITE_URL = 'https://bootstrap.studiomanfred.com/'
export const PLUGINS_URL = 'https://bootstrap.studiomanfred.com/plugins'
export const REPO_URL = 'https://github.com/Studio-Manfred/manfred-bootstrap'
export const GUIDE_CONTEXT_PATH = '/bootstrap-guide-context.md'

export const INTRO = {
  title: 'Manfred bootstrap',
  tagline: 'Stamp a Manfred project, hand it to Claude, and start shipping.',
}

export const WHY: string[] = [
  'Ship faster with Claude Code already configured — eight role-based agents, superpowers workflow, Linear-anchored branches.',
  'Design-system first. The `designer` agent checks the DS before building UI.',
  'CI, Playwright E2E, axe accessibility checks, and a coverage ratchet from day one.',
  'Linear-prefixed branches auto-close tickets on merge.',
  'Same way-of-working across every Manfred project.',
]

export const WHEN = {
  use: "you're starting a new Manfred project, or adding the way-of-working to an existing repo that's missing it.",
  dontUse: "you're working inside a client-owned repo (unless they've cleared it) or hacking on a one-week throwaway prototype.",
}

export const QUICK_START = {
  prerequisites: 'Node 20+, `git`, `gh` authenticated (for `--github`), Claude Code CLI installed.',
  command: `${INSTALL_URL} | bash -s -- new --name <project> --prefix STU --dir ./<project> --yes`,
  after: 'Then open `./<project>` in Claude Code and tell it to read `docs/ways-of-working-overview.md`.',
}

export type Example = { id: string; title: string; lede: string; command: string }

export const EXAMPLES: Example[] = [
  {
    id: 'minimal',
    title: 'Minimal — local only',
    lede: 'No GitHub, no Vercel, no Linear. Fastest path.',
    command: `${INSTALL_URL} | bash -s -- new --name acme --prefix STU --dir ./acme --yes`,
  },
  {
    id: 'full',
    title: 'Full provisioning — GitHub + Vercel + Linear',
    lede: 'Creates the GitHub repo, Vercel project, and Linear team in one shot.',
    command: `${INSTALL_URL} | bash -s -- new --name acme --prefix STU --dir ./acme --github --vercel --linear --linear-team STU --yes`,
  },
  {
    id: 'overlay',
    title: 'Overlay — add WoW to an existing repo',
    lede: 'Drops `.claude/`, `docs/`, and friends into a repo that already exists. Non-destructive.',
    command: `${INSTALL_URL} | bash -s -- overlay --dir ./existing-repo --prefix STU`,
  },
]

export const NEW_PROJECT = {
  command: `${INSTALL_URL} | bash -s -- new --name <project> --prefix STU --dir ./<project> --github --vercel --linear --linear-team STU --yes`,
  flags: [
    { flag: '--github', desc: 'Provisions the GitHub repo.' },
    { flag: '--vercel', desc: 'Provisions the Vercel project.' },
    { flag: '--linear', desc: 'Creates the Linear team (also enables ticket auto-close).' },
    { flag: '--yes', desc: 'Auto-approves provisioning prompts.' },
  ],
  ships: [
    'CI with coverage ratchet',
    'Playwright E2E',
    'axe accessibility checks',
    'The @studio-manfred design system',
    'Eight role-based Claude agents',
  ],
  after: 'Open the project in Claude Code, create your first Linear ticket (prefix `STU-`), and go.',
  cloneCommand: `${CLONE_PREFIX} new --name <project> --prefix STU --dir ../<project>`,
}

// Options the example commands use besides the provisioning flags. The flag table and the Markdown
// snapshot show these before NEW_PROJECT.flags. Wording follows docs/using-this-repo.md.
export const COMMAND_OPTIONS = [
  { flag: '--name', desc: 'Project name. Required for `new`; in `overlay` it defaults to the target directory name.' },
  { flag: '--prefix', desc: 'Linear team prefix, for example `STU`.' },
  { flag: '--dir', desc: 'Target directory path.' },
  { flag: '--linear-team', desc: 'Linear team key to create the project under. Defaults to `--prefix`.' },
]

export const EXISTING_PROJECT = {
  command: `${INSTALL_URL} | bash -s -- overlay --dir ./existing-repo --prefix STU`,
  bullets: [
    'Non-destructive. Only files declared in `overlay.manifest.json` are copied; existing files are never overwritten.',
    "Resolve any conflicts manually — the overlay doesn't touch your repo's source.",
  ],
  cloneCommand: `${CLONE_PREFIX} overlay --dir ../existing-repo --prefix STU`,
}

export const CLAUDE_SETUP = {
  intro: 'Install the Manfred Claude Code plugin marketplace. Pick only the plugins you need.',
  commands: ['/plugin marketplace add Studio-Manfred/manfred-shared-knowledge', '/plugin install manfred-dev@manfred'],
  optionalLabel: 'Optional: install home-level CLAUDE.md',
  optionalCommand: 'curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-shared-knowledge/main/install.sh | bash',
}

export const NEXT_STEPS: string[] = [
  'Open the Studio Manfred Linear workspace and create your first ticket (prefix `STU-`).',
  'Read `docs/ways-of-working-overview.md` and `docs/superpowers-workflow.md`.',
  'Keep a project `MEMORY.md` for session handoffs.',
  'Need help? Post in Slack `#tech-help`.',
]
