import { Link } from 'react-router-dom'
import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'claude'

export default function ClaudeSetup() {
  const headingId = 'claude-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Give Claude superpowers</Typography>
      <Typography variant="body">Install the Manfred Claude Code plugin marketplace. Pick only the plugins you need.</Typography>
      <CommandBlock command="/plugin marketplace add Studio-Manfred/manfred-shared-knowledge" />
      <CommandBlock command="/plugin install manfred-dev@manfred" />
      <Typography variant="body">
        See the <Link to="/plugins">full plugin list</Link>.
      </Typography>
      <CommandBlock
        command="curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-shared-knowledge/main/install.sh | bash"
        label="Optional: install home-level CLAUDE.md"
      />
    </VStack>
  )
}
