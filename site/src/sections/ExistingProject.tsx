import { CommandBlock } from '../components/CommandBlock'

export const ANCHOR_ID = 'existing'

export default function ExistingProject() {
  const headingId = 'existing-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>Path B — Existing project</h2>
      <CommandBlock command="node scripts/bootstrap.mjs overlay --dir ../existing-repo --prefix STU" />
      <ul>
        <li>
          Non-destructive. Only files declared in <code>overlay.manifest.json</code> are copied; existing files are
          never overwritten.
        </li>
        <li>Resolve any conflicts manually — the overlay doesn't touch your repo's source.</li>
      </ul>
    </section>
  )
}
