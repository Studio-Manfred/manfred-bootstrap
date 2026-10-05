import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { INSTALL_URL, CLONE_PREFIX } from '../lib/install'

export const ANCHOR_ID = 'new'

const FLAGS: { flag: string; desc: string }[] = [
  { flag: '--github', desc: 'Provisions the GitHub repo.' },
  { flag: '--vercel', desc: 'Provisions the Vercel project.' },
  { flag: '--linear', desc: 'Creates the Linear team (also enables ticket auto-close).' },
  { flag: '--yes', desc: 'Auto-approves provisioning prompts.' },
]

const SHIPS = [
  'CI with coverage ratchet',
  'Playwright E2E',
  'axe accessibility checks',
  'The @studio-manfred design system',
  'Eight role-based Claude agents',
]

export default function NewProject() {
  const headingId = 'new-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Path A — New project</Typography>
      <CommandBlock command={`${INSTALL_URL} | bash -s -- new --name <project> --prefix STU --dir ./<project> --github --vercel --linear --linear-team STU --yes`} />
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Provisioning flags</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-[var(--border)] p-2">Flag</th>
            <th scope="col" className="border-b border-[var(--border)] p-2">What it does</th>
          </tr>
        </thead>
        <tbody>
          {FLAGS.map((f) => (
            <tr key={f.flag}>
              <th scope="row" className="border-b border-[var(--border)] p-2">
                <code>{f.flag}</code>
              </th>
              <td className="border-b border-[var(--border)] p-2">{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography variant="headline3" as="h3">What ships</Typography>
      <ul className="list-disc space-y-1 pl-6">
        {SHIPS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Typography variant="body">
        Open the project in Claude Code, create your first Linear ticket (prefix <code>STU-</code>), and go.
      </Typography>
      <Typography variant="bodySmall">Prefer a local clone?</Typography>
      <CommandBlock command={`${CLONE_PREFIX} new --name <project> --prefix STU --dir ../<project>`} />
    </VStack>
  )
}
