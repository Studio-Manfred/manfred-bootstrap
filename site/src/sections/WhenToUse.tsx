import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { WHEN } from '../content/guide'
export const ANCHOR_ID = 'when'

export default function WhenToUse() {
  const headingId = 'when-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>When to use it</Typography>
      <Typography variant="body">
        <strong>Use it when:</strong> {WHEN.use}
      </Typography>
      <Typography variant="body">
        <strong>Don&apos;t use it when:</strong> {WHEN.dontUse}
      </Typography>
    </VStack>
  )
}
