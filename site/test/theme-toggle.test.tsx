import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeToggle } from '../src/components/ThemeToggle'
import { App } from '../src/App'

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

test('the single main landmark is a programmatically focusable skip target', () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  )
  expect(container.querySelectorAll('main')).toHaveLength(1)
  expect(container.querySelector('main')).toHaveAttribute('tabindex', '-1')
  expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument()
})
