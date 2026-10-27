import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import { App } from '../src/App'

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
}

test('Home renders Hero / Why / WhenToUse / QuickStart sections in order', () => {
  renderHome()
  const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
  expect(h2s.slice(0, 4)).toEqual(['Why this exists', 'When to use it', 'Quick start', 'Examples'])
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})

test('Hero CTAs link to #new and #existing', () => {
  renderHome()
  expect(screen.getByRole('link', { name: /start a new project/i })).toHaveAttribute('href', '#new')
  expect(screen.getByRole('link', { name: /add to an existing repo/i })).toHaveAttribute('href', '#existing')
})

test('Home shows the curl one-liner install command', () => {
  renderHome()
  const needle = 'curl -fsSL https://raw.githubusercontent.com/Studio-Manfred/manfred-bootstrap/main/install.sh | bash -s -- new'
  expect(screen.getAllByText((_, el) => el?.tagName === 'CODE' && !!el.textContent?.includes(needle)).length).toBeGreaterThan(0)
})
