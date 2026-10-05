import { Typography, VStack } from '@studio-manfred/manfred-design-system'
export const ANCHOR_ID = 'when'

export default function WhenToUse() {
  const headingId = 'when-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>When to use it</Typography>
      <Typography variant="body">
        <strong>Use it when:</strong> you&apos;re starting a new Manfred project, or adding the
        way-of-working to an existing repo that&apos;s missing it.
      </Typography>
      <Typography variant="body">
        <strong>Don&apos;t use it when:</strong> you&apos;re working inside a client-owned repo
        (unless they&apos;ve cleared it) or hacking on a one-week throwaway prototype.
      </Typography>
    </VStack>
  )
}
