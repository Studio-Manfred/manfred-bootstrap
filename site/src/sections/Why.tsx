import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { WHY } from '../content/guide'
export const ANCHOR_ID = 'why'

export default function Why() {
  const headingId = 'why-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Why this exists</Typography>
      <ul className="list-disc space-y-1 pl-6">
        {WHY.map((w) => (
          <li key={w}>
            <Inline text={w} />
          </li>
        ))}
      </ul>
    </VStack>
  )
}
