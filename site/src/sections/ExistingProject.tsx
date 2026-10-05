import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { INSTALL_URL, CLONE_PREFIX } from '../lib/install'

export const ANCHOR_ID = 'existing'

export default function ExistingProject() {
  const headingId = 'existing-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Path B — Existing project</Typography>
      <CommandBlock command={`${INSTALL_URL} | bash -s -- overlay --dir ./existing-repo --prefix STU`} />
      <ul className="list-disc space-y-1 pl-6">
        <li>
          Non-destructive. Only files declared in <code>overlay.manifest.json</code> are copied; existing files are
          never overwritten.
        </li>
        <li>Resolve any conflicts manually — the overlay doesn't touch your repo's source.</li>
      </ul>
      <Typography variant="bodySmall">Prefer a local clone?</Typography>
      <CommandBlock command={`${CLONE_PREFIX} overlay --dir ../existing-repo --prefix STU`} />
    </VStack>
  )
}
