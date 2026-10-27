import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { EXISTING_PROJECT } from '../content/guide'

export const ANCHOR_ID = 'existing'

export default function ExistingProject() {
  const headingId = 'existing-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Path B — Existing project</Typography>
      <CommandBlock command={EXISTING_PROJECT.command} />
      <ul className="list-disc space-y-1 pl-6">
        {EXISTING_PROJECT.bullets.map((b) => (
          <li key={b}>
            <Inline text={b} />
          </li>
        ))}
      </ul>
      <Typography variant="bodySmall">Prefer a local clone?</Typography>
      <CommandBlock command={EXISTING_PROJECT.cloneCommand} />
    </VStack>
  )
}
