import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'start'

export default function QuickStart() {
  const headingId = 'start-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Quick start</Typography>
      <Typography variant="body">
        Node 20+, <code>gh</code> authenticated, Claude Code CLI installed.
      </Typography>
      <CommandBlock command="node scripts/bootstrap.mjs new --name <project> --prefix STU --dir ../<project>" />
      <Typography variant="body">
        Open the new directory in Claude Code and tell it to read{' '}
        <code>docs/ways-of-working-overview.md</code>.
      </Typography>
      <Typography variant="body">
        <a href="#new">Full new-project flow →</a>
      </Typography>
    </VStack>
  )
}
