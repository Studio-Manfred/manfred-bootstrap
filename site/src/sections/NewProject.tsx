import { CommandBlock } from '../components/CommandBlock'

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
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>Path A — New project</h2>
      <CommandBlock command="node scripts/bootstrap.mjs new --name <project> --prefix STU --dir ../<project> --github --vercel --linear --linear-team STU --yes" />
      <table>
        <caption className="sr-only">Provisioning flags</caption>
        <thead>
          <tr>
            <th scope="col">Flag</th>
            <th scope="col">What it does</th>
          </tr>
        </thead>
        <tbody>
          {FLAGS.map((f) => (
            <tr key={f.flag}>
              <th scope="row">
                <code>{f.flag}</code>
              </th>
              <td>{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>What ships</h3>
      <ul>
        {SHIPS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <p>
        Open the project in Claude Code, create your first Linear ticket (prefix <code>STU-</code>), and go.
      </p>
    </section>
  )
}
