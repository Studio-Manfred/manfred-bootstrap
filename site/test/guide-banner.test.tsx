import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test, vi } from 'vitest'
import { App } from '../src/App'
import { CLAUDE_DEEP_LINK_PREFIX, buildClaudePrompt } from '../src/lib/claude-prompt'
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
  const banner = screen.getByRole('region', { name: /låt claude guida dig/i })
  const hero = screen.getByRole('heading', { level: 1 })
  const why = screen.getByRole('heading', { name: 'Why this exists' })
  expect(hero.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(banner.compareDocumentPosition(why) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(within(banner).getByText(/hellre i chatformat\?/i)).toBeInTheDocument()
  expect(within(banner).getByText(/all bootstrap-kontext kommer från den här guiden/i)).toBeInTheDocument()
})

test('primary link is a claude:// deep link whose q decodes to the full prompt', () => {
  renderHome()
  const link = screen.getByRole('link', { name: /öppna i claude desktop/i })
  const href = link.getAttribute('href') ?? ''
  expect(href.startsWith(CLAUDE_DEEP_LINK_PREFIX)).toBe(true)
  expect(decodeURIComponent(href.slice(CLAUDE_DEEP_LINK_PREFIX.length))).toBe(buildClaudePrompt())
})

test('markdown fallback link downloads the generated file', () => {
  renderHome()
  const link = screen.getByRole('link', { name: /hämta markdown-version/i })
  expect(link).toHaveAttribute('href', GUIDE_CONTEXT_PATH)
  expect(link).toHaveAttribute('download', 'bootstrap-guide-context.md')
})

test('after opening, the copy fallback copies exactly the prompt the deep link carries and announces it', async () => {
  const user = userEvent.setup()
  renderHome()
  await user.click(screen.getByRole('link', { name: /öppna i claude desktop/i }))
  const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(screen.getByRole('button', { name: /kopiera instruktionen/i }))
  expect(writeText).toHaveBeenCalledWith(buildClaudePrompt())
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/kopierad/i))
})

test('copy failure shows an understandable error', async () => {
  const user = userEvent.setup()
  renderHome()
  await user.click(screen.getByRole('link', { name: /öppna i claude desktop/i }))
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
  await user.click(screen.getByRole('button', { name: /kopiera instruktionen/i }))
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/kunde inte kopiera/i))
})

test('existing hero links and sections are unchanged', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /start a new project/i })).toHaveAttribute('href', '#new')
  expect(screen.getByRole('link', { name: /add to an existing repo/i })).toHaveAttribute('href', '#existing')
  expect(screen.getByRole('link', { name: /full plugin list/i })).toHaveAttribute('href', '/plugins')
})
