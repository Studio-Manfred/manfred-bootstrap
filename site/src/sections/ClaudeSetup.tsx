import { Link } from 'react-router-dom'
import { CommandBlock } from '../components/CommandBlock'
import { CLAUDE_SETUP } from '../content/guide'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'claude'

export default function ClaudeSetup() {
  const headingId = 'claude-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Give Claude superpowers</Typography>
      <Typography variant="body">{CLAUDE_SETUP.intro}</Typography>
      {CLAUDE_SETUP.commands.map((c) => (
        <CommandBlock key={c} command={c} />
      ))}
      <Typography variant="body">
        See the <Link to="/plugins">full plugin list</Link>.
      </Typography>
      <CommandBlock command={CLAUDE_SETUP.optionalCommand} label={CLAUDE_SETUP.optionalLabel} />
    </VStack>
  )
}
