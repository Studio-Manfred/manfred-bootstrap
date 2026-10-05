import { Typography, VStack } from '@studio-manfred/manfred-design-system'
export const ANCHOR_ID = 'why'

export default function Why() {
  const headingId = 'why-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Why this exists</Typography>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          Ship faster with Claude Code already configured — eight role-based agents, superpowers
          workflow, Linear-anchored branches.
        </li>
        <li>
          Design-system first. The <code>designer</code> agent checks the DS before building UI.
        </li>
        <li>CI, Playwright E2E, axe accessibility checks, and a coverage ratchet from day one.</li>
        <li>Linear-prefixed branches auto-close tickets on merge.</li>
        <li>Same way-of-working across every Manfred project.</li>
      </ul>
    </VStack>
  )
}
