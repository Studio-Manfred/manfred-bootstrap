import { useEffect, useState, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@studio-manfred/manfred-design-system'

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

  useEffect(() => {
    const onHash = () => setActive(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const select = (value: string) => {
    const v = value as PathValue
    setActive(v)
    if (window.location.hash !== `#${v}`) window.location.hash = v
  }

  return (
    <Tabs value={active} onValueChange={select}>
      <TabsList aria-label="Project type">
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((t) => (
        // forceMount keeps both panels in the DOM; Radix does not hide force-mounted panels, so set `hidden` explicitly.
        <TabsContent key={t.value} value={t.value} forceMount hidden={t.value !== active} className="pt-4">
          {panels[t.value]}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default PathTabs
