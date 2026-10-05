import { Link } from 'react-router-dom'
import { CommandBlock } from '../components/CommandBlock'

export const ANCHOR_ID = 'claude'

export default function ClaudeSetup() {
  const headingId = 'claude-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>Give Claude superpowers</h2>
      <p>Install the Manfred Claude Code plugin marketplace. Pick only the plugins you need.</p>
      <CommandBlock command="/plugin marketplace add Studio-Manfred/manfred-shared-knowledge" />
      <CommandBlock command="/plugin install manfred-dev@manfred" />
      <p>
        See the <Link to="/plugins">full plugin list</Link>.
      </p>
      <CommandBlock
        command="curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-shared-knowledge/main/install.sh | bash"
        label="Optional: install home-level CLAUDE.md"
      />
    </section>
  )
}
