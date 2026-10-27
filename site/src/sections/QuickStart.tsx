import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { QUICK_START } from '../content/guide'

export const ANCHOR_ID = 'start'

export default function QuickStart() {
  const headingId = 'start-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Quick start</Typography>
      <Typography variant="body">
        <Inline text={QUICK_START.prerequisites} />
      </Typography>
      <CommandBlock command={QUICK_START.command} />
      <Typography variant="body">
        <Inline text={QUICK_START.after} />
      </Typography>
      <Typography variant="body">
        <a href="#new">Full new-project flow →</a> · <a href="#examples">More examples →</a>
      </Typography>
    </VStack>
  )
}
