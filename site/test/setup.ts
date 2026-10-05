import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

function createStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() {
      return map.size
    },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k)
    },
    setItem: (k: string, v: string) => {
      map.set(k, String(v))
    },
  }
}

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', { configurable: true, writable: true, value: createStorage() })
  Object.defineProperty(window, 'sessionStorage', { configurable: true, writable: true, value: createStorage() })
})

afterEach(() => {
  cleanup()
})
