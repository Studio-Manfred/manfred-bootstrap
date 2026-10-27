import { render, screen, within } from '@testing-library/react'
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

test('last four h2s are the bottom sections', () => {
  renderHome()
  const h2s = screen.getAllByRole('heading', { level: 2, hidden: true }).map((h) => h.textContent)
  expect(h2s.slice(-4)).toEqual([
    'Path A — New project',
    'Path B — Existing project',
    'Give Claude superpowers',
    'Next steps',
  ])
})

test('New and Existing share a single tablist', () => {
  renderHome()
  expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['New project', 'Existing project'])
})

test('NextSteps mentions #tech-help', () => {
  renderHome()
  expect(screen.getByText(/#tech-help/)).toBeInTheDocument()
})

test('the flag table explains the options the commands use', () => {
  renderHome()
  const table = screen.getByRole('table', { name: /command options/i, hidden: true })
  for (const opt of ['--name', '--prefix', '--dir', '--linear-team', '--github', '--yes']) {
    expect(within(table).getByRole('rowheader', { name: opt, hidden: true })).toBeInTheDocument()
  }
})
