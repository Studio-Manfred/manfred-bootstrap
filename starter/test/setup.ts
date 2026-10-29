import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// @testing-library/dom drains its async wrapper with a real setTimeout(0) and only
// advances fake timers through a global `jest`. Under Vitest fake timers that
// drain never resolves (every userEvent call hangs), so expose the same hook.
Object.assign(globalThis, {
  jest: { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) },
})

afterEach(() => {
  cleanup()
})
