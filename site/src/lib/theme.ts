export type Theme = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'manfred.theme'

const THEMES: readonly Theme[] = ['light', 'dark', 'system']

export function readStoredTheme(): Theme {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return THEMES.includes(value as Theme) ? (value as Theme) : 'system'
  } catch {
    return 'system'
  }
}

export function writeStoredTheme(t: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, t)
  } catch {
    // Storage blocked (private mode, policy): the choice just won't persist.
  }
}

export function prefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export function applyTheme(t: Theme): void {
  const resolved = t === 'system' ? (prefersDark() ? 'dark' : 'light') : t
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  // The design system's tokens.css keys dark mode off .dark/.light classes on <html>,
  // so mirror data-theme there to make DS tokens follow the toggle.
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
}

export function nextTheme(t: Theme): Theme {
  if (t === 'light') return 'dark'
  if (t === 'dark') return 'system'
  return 'light'
}
