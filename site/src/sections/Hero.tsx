export const ANCHOR_ID = 'top'

const ctaBase =
  'inline-block rounded px-4 py-2 font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]'

export default function Hero() {
  const headingId = 'hero-heading'
  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-16">
      <h1 id={headingId}>Manfred bootstrap</h1>
      <p>Stamp a Manfred project, hand it to Claude, and start shipping.</p>
      <p className="flex flex-wrap gap-3">
        <a
          href="#new"
          className={`${ctaBase} bg-[var(--color-text-primary)] text-[var(--color-surface-default)]`}
        >
          Start a new project
        </a>
        <a
          href="#existing"
          className={`${ctaBase} border border-[var(--color-border-default)] text-[var(--color-text-primary)]`}
        >
          Add to an existing repo
        </a>
      </p>
    </section>
  )
}
