import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { Home } from '../src/routes/Home'
import { Plugins } from '../src/routes/Plugins'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('theme-transition')
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
})

test('clicking cycles theme and updates data-theme', async () => {
  render(<ThemeToggle />)
  const btn = screen.getByRole('button')
  expect(btn).toHaveAccessibleName(/switch to light theme/i)
  await userEvent.click(btn)
  expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  expect(localStorage.getItem('manfred.theme')).toBe('light')
  expect(btn).toHaveAccessibleName(/switch to dark theme/i)
})

test('Enter and Space activate the toggle', async () => {
  render(<ThemeToggle />)
  const btn = screen.getByRole('button')
  btn.focus()
  await userEvent.keyboard('{Enter}')
  expect(localStorage.getItem('manfred.theme')).toBe('light')
  await userEvent.keyboard(' ')
  expect(localStorage.getItem('manfred.theme')).toBe('dark')
})

test('reduced motion disables transition class', async () => {
  window.matchMedia = ((q: string) => ({
    matches: q.includes('reduced'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
  render(<ThemeToggle />)
  await userEvent.click(screen.getByRole('button'))
  expect(document.documentElement).not.toHaveClass('theme-transition')
})

test('main landmarks are programmatically focusable skip targets', () => {
  const { container } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
  expect(container.querySelector('main#main')).toHaveAttribute('tabindex', '-1')
  const r2 = render(<Plugins />)
  expect(r2.container.querySelector('main#main')).toHaveAttribute('tabindex', '-1')
})
