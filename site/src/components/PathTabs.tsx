import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

type PathValue = 'new' | 'existing'

const TABS: { value: PathValue; label: string }[] = [
  { value: 'new', label: 'New project' },
  { value: 'existing', label: 'Existing project' },
]

function fromHash(): PathValue {
  return window.location.hash === '#existing' ? 'existing' : 'new'
}

export interface PathTabsProps {
  panels: { new: ReactNode; existing: ReactNode }
}

export function PathTabs({ panels }: PathTabsProps) {
  const [active, setActive] = useState<PathValue>(fromHash)
  const refs = useRef<Record<PathValue, HTMLButtonElement | null>>({ new: null, existing: null })

  useEffect(() => {
    const onHash = () => setActive(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const select = (value: PathValue, focus = false) => {
    setActive(value)
    if (window.location.hash !== `#${value}`) window.location.hash = value
    if (focus) refs.current[value]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex((t) => t.value === active)
    let next: number
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    else return
    e.preventDefault()
    select(TABS[next].value, true)
  }

  return (
    <div>
      <div role="tablist" aria-label="Project type" className="flex gap-2 border-b border-[var(--color-border-default)]">
        {TABS.map((t) => {
          const isActive = t.value === active
          return (
            <button
              key={t.value}
              ref={(el) => {
                refs.current[t.value] = el
              }}
              type="button"
              role="tab"
              id={`tab-${t.value}`}
              aria-selected={isActive}
              aria-controls={`panel-${t.value}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(t.value)}
              onKeyDown={onKeyDown}
              className={`px-4 py-2 font-semibold border-b-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)] ${isActive ? 'border-current' : 'border-transparent opacity-70'}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {TABS.map((t) => (
        <div
          key={t.value}
          role="tabpanel"
          id={`panel-${t.value}`}
          aria-labelledby={`tab-${t.value}`}
          hidden={t.value !== active}
          className="pt-4"
        >
          {panels[t.value]}
        </div>
      ))}
    </div>
  )
}

export default PathTabs
