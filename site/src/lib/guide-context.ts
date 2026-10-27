import {
  CLAUDE_SETUP,
  COMMAND_OPTIONS,
  EXAMPLES,
  EXISTING_PROJECT,
  INTRO,
  NEW_PROJECT,
  NEXT_STEPS,
  PLUGINS_URL,
  QUICK_START,
  REPO_URL,
  SITE_URL,
  WHEN,
  WHY,
} from '../content/guide'
import { PLUGINS } from '../content/plugins'

export type PluginDetail = 'full' | 'compact'

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n')
const code = (cmd: string) => '```bash\n' + cmd + '\n```'

function pluginSection(detail: PluginDetail): string {
  const lines = PLUGINS.map((p) => {
    if (detail === 'compact') return `- ${p.slug}: ${p.pitch}`
    const extras = [
      p.skills.length ? `skills: ${p.skills.join(', ')}` : '',
      p.commands.length ? `commands: ${p.commands.join(', ')}` : '',
    ].filter(Boolean)
    return `- ${p.slug}: ${p.pitch}${extras.length ? ` (${extras.join('; ')})` : ''}`
  })
  return [
    CLAUDE_SETUP.intro,
    code(CLAUDE_SETUP.commands.join('\n')),
    `Install any other plugin with \`/plugin install <name>@manfred\`. Full list: ${PLUGINS_URL}`,
    lines.join('\n'),
  ].join('\n\n')
}

/** Markdown snapshot of the live guide, generated from src/content/guide.ts and plugins.ts. */
export function buildGuideContext({ pluginDetail = 'full' }: { pluginDetail?: PluginDetail } = {}): string {
  const sections: [string, string][] = [
    ['What Manfred Bootstrap is', `${INTRO.title}: ${INTRO.tagline} It is a template and installer (\`install.sh\`) that either scaffolds a new Manfred project or overlays the Manfred way-of-working onto an existing repo.`],
    ['Why it exists', bullets(WHY)],
    ['When to use it', `Use it when: ${WHEN.use}\n\nDon't use it when: ${WHEN.dontUse}`],
    ['Prerequisites', QUICK_START.prerequisites],
    ['Quick start', [code(QUICK_START.command), QUICK_START.after].join('\n\n')],
    ['Examples', EXAMPLES.map((e) => `### ${e.title}\n${e.lede}\n${code(e.command)}`).join('\n\n')],
    [
      'Path A — New project',
      [
        code(NEW_PROJECT.command),
        NEW_PROJECT.after,
        'Prefer a local clone?',
        code(NEW_PROJECT.cloneCommand),
      ].join('\n\n'),
    ],
    [
      'Path B — Existing project',
      [code(EXISTING_PROJECT.command), bullets(EXISTING_PROJECT.bullets), 'Prefer a local clone?', code(EXISTING_PROJECT.cloneCommand)].join('\n\n'),
    ],
    ['Flags', [...COMMAND_OPTIONS, ...NEW_PROJECT.flags].map((f) => `- \`${f.flag}\`: ${f.desc}`).join('\n')],
    ['What gets installed or created', bullets(NEW_PROJECT.ships)],
    ['Claude plugins', pluginSection(pluginDetail)],
    ['Next steps', bullets(NEXT_STEPS)],
    ['Links', bullets([`Live guide: ${SITE_URL}`, `Plugins: ${PLUGINS_URL}`, `GitHub repo: ${REPO_URL}`])],
  ]
  return `# Manfred Bootstrap guide (snapshot)\n\nSource: ${SITE_URL}\n\n` + sections.map(([t, body]) => `## ${t}\n\n${body}`).join('\n\n') + '\n'
}
