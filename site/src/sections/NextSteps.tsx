import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { NEXT_STEPS } from '../content/guide'
export const ANCHOR_ID = 'next'

export default function NextSteps() {
  const headingId = 'next-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Next steps</Typography>
      <ul className="list-disc space-y-1 pl-6">
        {NEXT_STEPS.map((n) => (
          <li key={n}>
            <Inline text={n} />
          </li>
        ))}
      </ul>
    </VStack>
  )
}
