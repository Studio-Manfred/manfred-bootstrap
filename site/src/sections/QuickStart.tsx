import { CommandBlock } from '../components/CommandBlock'

export const ANCHOR_ID = 'start'

export default function QuickStart() {
  const headingId = 'start-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>Quick start</h2>
      <p>
        Node 20+, <code>gh</code> authenticated, Claude Code CLI installed.
      </p>
      <CommandBlock command="node scripts/bootstrap.mjs new --name <project> --prefix STU --dir ../<project>" />
      <p>
        Open the new directory in Claude Code and tell it to read{' '}
        <code>docs/ways-of-working-overview.md</code>.
      </p>
      <p>
        <a href="#new">Full new-project flow →</a>
      </p>
    </section>
  )
}
