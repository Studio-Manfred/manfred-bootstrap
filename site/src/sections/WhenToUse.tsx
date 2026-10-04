export const ANCHOR_ID = 'when'

export default function WhenToUse() {
  const headingId = 'when-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId}>When to use it</h2>
      <p>
        <strong>Use it when:</strong> you&apos;re starting a new Manfred project, or adding the
        way-of-working to an existing repo that&apos;s missing it.
      </p>
      <p>
        <strong>Don&apos;t use it when:</strong> you&apos;re working inside a client-owned repo
        (unless they&apos;ve cleared it) or hacking on a one-week throwaway prototype.
      </p>
    </section>
  )
}
