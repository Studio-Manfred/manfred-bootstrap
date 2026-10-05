import { useEffect, useState } from 'react'
import { Button } from '@studio-manfred/manfred-design-system'
import {
  applyTheme,
  nextTheme,
  prefersReducedMotion,
  readStoredTheme,
  writeStoredTheme,
  type Theme,
} from '../lib/theme'

const LABELS: Record<Theme, string> = { light: 'light', dark: 'dark', system: 'system' }

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [theme])

  function handleClick() {
    const next = nextTheme(theme)
    // Only animate theme changes when the user has not asked for reduced motion.
    const animate = !prefersReducedMotion()
    const root = document.documentElement
    if (animate) {
      root.classList.add('theme-transition')
      window.setTimeout(() => root.classList.remove('theme-transition'), 300)
    }
    writeStoredTheme(next)
    setTheme(next)
  }

  const next = nextTheme(theme)
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label={`Switch to ${LABELS[next]} theme`}
    >
      <span aria-hidden="true">Theme: {LABELS[theme]}</span>
    </Button>
  )
}
