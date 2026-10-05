import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { CommandBlock } from '../src/components/CommandBlock'

const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

function setClipboard(value: unknown) {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true })
}

beforeEach(() => {
  setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  if (original) Object.defineProperty(navigator, 'clipboard', original)
  else Reflect.deleteProperty(navigator, 'clipboard')
})

test('clicking copies command to clipboard and announces', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  setClipboard({ writeText })
  render(<CommandBlock command="npm run dev" />)
  await userEvent.click(screen.getByRole('button', { name: /copy/i }))
  expect(writeText).toHaveBeenCalledWith('npm run dev')
  expect(await screen.findByText(/copied/i)).toBeInTheDocument()
})

test('copied state reverts after 2000ms', async () => {
  vi.useFakeTimers()
  render(<CommandBlock command="x" />)
  // fireEvent + manual flush: userEvent's internal waits hang under fake timers.
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /copy/i }))
  })
  expect(screen.getByText(/copied/i)).toBeInTheDocument()
  act(() => {
    vi.advanceTimersByTime(1999)
  })
  expect(screen.getByText(/copied/i)).toBeInTheDocument()
  act(() => {
    vi.advanceTimersByTime(1)
  })
  expect(screen.queryByText(/copied/i)).not.toBeInTheDocument()
})

test('shows fallback hint when clipboard API rejects', async () => {
  setClipboard({ writeText: () => Promise.reject(new Error('nope')) })
  render(<CommandBlock command="x" />)
  await userEvent.click(screen.getByRole('button', { name: /copy/i }))
  expect(await screen.findByText(/cmd\/ctrl\+c/i)).toBeInTheDocument()
  expect(screen.queryByText(/^copied$/i)).not.toBeInTheDocument()
})

test('shows fallback hint when clipboard is undefined', async () => {
  setClipboard(undefined)
  render(<CommandBlock command="x" />)
  await userEvent.click(screen.getByRole('button', { name: /copy/i }))
  expect(await screen.findByText(/cmd\/ctrl\+c/i)).toBeInTheDocument()
})
