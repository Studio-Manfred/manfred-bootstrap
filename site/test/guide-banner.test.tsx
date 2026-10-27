import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test, vi } from 'vitest'
import { App } from '../src/App'
import { buildClaudePrompt } from '../src/lib/claude-prompt'
import { GUIDE_CONTEXT_PATH } from '../src/content/guide'

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => vi.restoreAllMocks())

test('banner is a labelled region placed after the hero and before "Why this exists"', () => {
  renderHome()
  const banner = screen.getByRole('region', { name: /let ai guide you/i })
  const hero = screen.getByRole('heading', { level: 1 })
  const why = screen.getByRole('heading', { name: 'Why this exists' })
  expect(hero.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(banner.compareDocumentPosition(why) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(within(banner).getByText(/prefer a chat\?/i)).toBeInTheDocument()
  expect(within(banner).getByText(/all bootstrap context comes from this guide/i)).toBeInTheDocument()
})

test('the banner opens nothing: it has no claude:// link', () => {
  renderHome()
  const banner = screen.getByRole('region', { name: /let ai guide you/i })
  expect(banner.querySelector('a[href^="claude:"]')).toBeNull()
})

test('markdown fallback link downloads the generated file', () => {
  renderHome()
  const link = screen.getByRole('link', { name: /download markdown version/i })
  expect(link).toHaveAttribute('href', GUIDE_CONTEXT_PATH)
  expect(link).toHaveAttribute('download', 'bootstrap-guide-context.md')
})

test('copy button copies the full prompt and tells the user where to paste it', async () => {
  const user = userEvent.setup()
  renderHome()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(screen.getByRole('button', { name: /copy the prompt/i }))
  expect(writeText).toHaveBeenCalledWith(buildClaudePrompt())
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/paste it into any chat.*claude or chatgpt/i))
})

test('copy failure shows an understandable error', async () => {
  const user = userEvent.setup()
  renderHome()
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
  await user.click(screen.getByRole('button', { name: /copy the prompt/i }))
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/could not copy/i))
})

test('the status area is empty before any click', () => {
  renderHome()
  expect(screen.getByRole('status')).toBeEmptyDOMElement()
})

test('existing hero links and sections are unchanged', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /start a new project/i })).toHaveAttribute('href', '#new')
  expect(screen.getByRole('link', { name: /add to an existing repo/i })).toHaveAttribute('href', '#existing')
  expect(screen.getByRole('link', { name: /full plugin list/i })).toHaveAttribute('href', '/plugins')
})
