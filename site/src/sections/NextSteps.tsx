import { Typography, VStack } from '@studio-manfred/manfred-design-system'
export const ANCHOR_ID = 'next'

export default function NextSteps() {
  const headingId = 'next-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Next steps</Typography>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          Open the Studio Manfred Linear workspace and create your first ticket (prefix <code>STU-</code>).
        </li>
        <li>
          Read <code>docs/ways-of-working-overview.md</code> and <code>docs/superpowers-workflow.md</code>.
        </li>
        <li>
          Keep a project <code>MEMORY.md</code> for session handoffs.
        </li>
        <li>Need help? Post in Slack <code>#tech-help</code>.</li>
      </ul>
    </VStack>
  )
}
