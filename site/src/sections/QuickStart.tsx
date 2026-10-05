import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { INSTALL_URL } from '../lib/install'

export const ANCHOR_ID = 'start'

export default function QuickStart() {
  const headingId = 'start-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Quick start</Typography>
      <Typography variant="body">
        Node 20+, <code>git</code>, <code>gh</code> authenticated (for <code>--github</code>), Claude Code CLI installed.
      </Typography>
      <CommandBlock command={`${INSTALL_URL} | bash -s -- new --name <project> --prefix STU --dir ./<project> --yes`} />
      <Typography variant="body">
        Then open <code>./&lt;project&gt;</code> in Claude Code and tell it to read{' '}
        <code>docs/ways-of-working-overview.md</code>.
      </Typography>
      <Typography variant="body">
        <a href="#new">Full new-project flow →</a> · <a href="#examples">More examples →</a>
      </Typography>
    </VStack>
  )
}
