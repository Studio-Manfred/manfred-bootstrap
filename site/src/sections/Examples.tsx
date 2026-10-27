import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { EXAMPLES } from '../content/guide'

export const ANCHOR_ID = 'examples'

export default function Examples() {
  const headingId = 'examples-heading'
  return (
    <VStack as="section" gap={6} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-20">
      <VStack gap={2}>
        <Typography variant="headline2" as="h2" id={headingId}>Examples</Typography>
        <Typography variant="bodySmall">
          Copy, paste, run. Each command bootstraps a fresh project in seconds.
        </Typography>
      </VStack>
      {EXAMPLES.map((e) => (
        <article key={e.id} className="rounded-lg border border-[var(--border)] p-4">
          <VStack gap={3}>
            <Typography variant="headline4" as="h3">{e.title}</Typography>
            <Typography variant="bodySmall">
              <Inline text={e.lede} />
            </Typography>
            <CommandBlock command={e.command} />
          </VStack>
        </article>
      ))}
    </VStack>
  )
}
