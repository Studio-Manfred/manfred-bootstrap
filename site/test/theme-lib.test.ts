import { readStoredTheme, writeStoredTheme, nextTheme, applyTheme } from '../src/lib/theme'

test('readStoredTheme returns system when storage throws', () => {
  const orig = Storage.prototype.getItem
  Storage.prototype.getItem = () => {
    throw new Error('blocked')
  }
  expect(readStoredTheme()).toBe('system')
  Storage.prototype.getItem = orig
})

test('writeStoredTheme does not throw when storage throws', () => {
  const orig = Storage.prototype.setItem
  Storage.prototype.setItem = () => {
    throw new Error('blocked')
  }
  expect(() => writeStoredTheme('dark')).not.toThrow()
  Storage.prototype.setItem = orig
})

test('nextTheme cycles light → dark → system → light', () => {
  expect(nextTheme('light')).toBe('dark')
  expect(nextTheme('dark')).toBe('system')
  expect(nextTheme('system')).toBe('light')
})

test('applyTheme sets data-theme to OS pref when system and OS is dark', () => {
  const mql = { matches: true } as MediaQueryList
  window.matchMedia = () => mql as MediaQueryList
  applyTheme('system')
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
})
