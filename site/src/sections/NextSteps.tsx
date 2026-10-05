export const ANCHOR_ID = 'next'

export default function NextSteps() {
  const headingId = 'next-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>Next steps</h2>
      <ul>
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
    </section>
  )
}
