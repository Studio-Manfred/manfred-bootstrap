import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, test, vi } from 'vitest'
import { App } from '../src/App'
import { buildClaudePrompt, buildPromptExcerpt } from '../src/lib/claude-prompt'
import { GUIDE_CONTEXT_PATH } from '../src/content/guide'

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

async function openDialog() {
  const user = userEvent.setup()
  renderHome()
  const trigger = screen.getByRole('button', { name: 'Let AI guide you' })
  await user.click(trigger)
  const dialog = await screen.findByRole('dialog', { name: /let ai guide you/i })
  return { user, trigger, dialog }
}

afterEach(() => vi.restoreAllMocks())

test('the hero has three buttons, the AI guide button last', () => {
  renderHome()
  const hero = screen.getByRole('heading', { level: 1 }).closest('section') as HTMLElement
  const names = within(hero)
    .getAllByRole('link')
    .map((l) => l.textContent?.trim())
    .concat(within(hero).getAllByRole('button').map((b) => b.textContent?.trim()))
  expect(names).toEqual(['Start a new project', 'Add to an existing repo', 'Let AI guide you'])
  const buttons = within(hero).getAllByRole('button')
  expect(buttons).toHaveLength(1)
  expect(buttons[0]).toHaveAccessibleName('Let AI guide you')
})

test('there is no text link or #claude-guide section: the hero button is the only way in', () => {
  renderHome()
  expect(screen.queryByText(/prefer a chat\?/i)).toBeNull()
  expect(screen.queryByRole('button', { name: /open the ai guide/i })).toBeNull()
  expect(document.getElementById('claude-guide')).toBeNull()
})

test('the hero button carries the AI icon', () => {
  renderHome()
  const button = screen.getByRole('button', { name: 'Let AI guide you' })
  expect(button.querySelector('svg[data-icon="ai"]')).not.toBeNull()
})

test('no claude:// link and no unverified tool names anywhere in the dialog', async () => {
  const { dialog } = await openDialog()
  expect(document.querySelector('a[href^="claude:"]')).toBeNull()
  expect(dialog).not.toHaveTextContent(/gemini/i)
})

test('the dialog explains the idea, shows a real excerpt and offers copy and download', async () => {
  const { dialog } = await openDialog()
  expect(within(dialog).getByText(/prefer a chat\?/i)).toBeInTheDocument()
  expect(within(dialog).getByRole('heading', { name: 'Let AI guide you' })).toBeInTheDocument()
  expect(dialog).toHaveTextContent(buildPromptExcerpt(buildClaudePrompt()).replace(/\s+/g, ' '))
  expect(within(dialog).getByRole('button', { name: /copy the prompt/i })).toBeVisible()
  const link = within(dialog).getByRole('link', { name: /download markdown version/i })
  expect(link).toHaveAttribute('href', GUIDE_CONTEXT_PATH)
  expect(link).toHaveAttribute('download', 'bootstrap-guide-context.md')
  expect(within(dialog).getByRole('status')).toBeEmptyDOMElement()
})

test('copy copies the exact prompt and moves to the "Prompt copied!" state', async () => {
  const { user, dialog } = await openDialog()
  const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(within(dialog).getByRole('button', { name: /copy the prompt/i }))
  expect(writeText).toHaveBeenCalledWith(buildClaudePrompt())
  expect(await screen.findByRole('heading', { name: 'Prompt copied!' })).toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent(/cmd\+v or ctrl\+v/i)
  expect(screen.queryByRole('button', { name: /copy the prompt/i })).toBeNull()
  expect(screen.queryByRole('link', { name: /download markdown version/i })).toBeNull()
})

test('the copied state offers Claude, ChatGPT and Gemini as plain links without a prompt in the URL', async () => {
  const { user, dialog } = await openDialog()
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(within(dialog).getByRole('button', { name: /copy the prompt/i }))
  await screen.findByRole('heading', { name: 'Prompt copied!' })
  const expected: Record<string, string> = {
    claude: 'https://claude.ai/new',
    chatgpt: 'https://chatgpt.com/',
    gemini: 'https://gemini.google.com/app',
  }
  for (const [name, href] of Object.entries(expected)) {
    const link = screen.getByRole('link', { name: new RegExp(`^${name}.*opens in a new tab`, 'i') })
    expect(link).toHaveAttribute('href', href)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
  expect(document.querySelector('a[href^="claude:"], a[href*="?q="]')).toBeNull()
})

test('Back returns to the first state and puts focus on the copy button', async () => {
  const { user, dialog } = await openDialog()
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(within(dialog).getByRole('button', { name: /copy the prompt/i }))
  await screen.findByRole('heading', { name: 'Prompt copied!' })
  await user.click(screen.getByRole('button', { name: 'Back' }))
  const copy = await screen.findByRole('button', { name: /copy the prompt/i })
  expect(copy).toHaveFocus()
  expect(screen.getByRole('link', { name: /download markdown version/i })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: /opens in a new tab/i })).toBeNull()
})

test('copy failure stays in the first state: no "copied", no tool links, and an understandable error', async () => {
  const { user, dialog } = await openDialog()
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'))
  await user.click(within(dialog).getByRole('button', { name: /copy the prompt/i }))
  await waitFor(() => expect(within(dialog).getByRole('status')).toHaveTextContent(/could not copy/i))
  expect(screen.queryByRole('heading', { name: 'Prompt copied!' })).toBeNull()
  expect(screen.queryByRole('link', { name: /opens in a new tab/i })).toBeNull()
  expect(within(dialog).getByRole('link', { name: /download markdown version/i })).toBeInTheDocument()
})

test('Escape closes the dialog and returns focus to the hero button', async () => {
  const { user, trigger } = await openDialog()
  await user.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(trigger).toHaveFocus()
})

test('the close button closes the dialog and reopening starts in the first state', async () => {
  const { user, dialog } = await openDialog()
  vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
  await user.click(within(dialog).getByRole('button', { name: /copy the prompt/i }))
  await screen.findByRole('heading', { name: 'Prompt copied!' })
  await user.click(screen.getByRole('button', { name: /close/i }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await user.click(screen.getByRole('button', { name: 'Let AI guide you' }))
  const again = await screen.findByRole('dialog', { name: /let ai guide you/i })
  expect(within(again).getByRole('button', { name: /copy the prompt/i })).toBeInTheDocument()
  expect(within(again).getByRole('status')).toBeEmptyDOMElement()
})

test('the hero buttons use the agreed colours: existing repo blue outline, AI guide black outline', () => {
  renderHome()
  const existing = screen.getByRole('link', { name: /add to an existing repo/i })
  const guide = screen.getByRole('button', { name: 'Let AI guide you' })
  expect(existing.className).toMatch(/border-\[var\(--color-border-brand\)\]/)
  expect(existing.className).toMatch(/text-\[var\(--color-text-brand\)\]/)
  expect(guide.className).not.toMatch(/--color-border-brand|--color-text-brand/)
})

test('existing hero links and sections are unchanged', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /start a new project/i })).toHaveAttribute('href', '#new')
  expect(screen.getByRole('link', { name: /add to an existing repo/i })).toHaveAttribute('href', '#existing')
  expect(screen.getByRole('link', { name: /full plugin list/i })).toHaveAttribute('href', '/plugins')
})
