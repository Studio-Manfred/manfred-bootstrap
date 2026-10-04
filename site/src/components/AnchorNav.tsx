import { useEffect, useState } from 'react'

export interface AnchorNavItem {
  id: string
  label: string
}

export function AnchorNav({ items }: { items: AnchorNavItem[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const ratios = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0)
        }
        let best: string | undefined
        let bestRatio = 0
        for (const [id, r] of ratios) {
          if (r > bestRatio) {
            best = id
            bestRatio = r
          }
        }
        setActiveId(best ?? items[0]?.id)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    for (const it of items) {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-10 border-b border-[var(--color-border-default)] bg-[var(--color-surface-default)]"
    >
      <ul className="m-0 flex list-none flex-wrap gap-4 p-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={activeId === it.id ? 'location' : undefined}
              className="rounded px-2 py-1 text-[var(--color-text-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)] aria-[current=location]:font-semibold aria-[current=location]:underline"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
