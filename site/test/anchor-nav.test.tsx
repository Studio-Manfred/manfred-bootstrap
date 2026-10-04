import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AnchorNav } from '../src/components/AnchorNav'

const items = [
  { id: 'one', label: 'One' },
  { id: 'two', label: 'Two' },
]

test('renders one link per item with href and label', () => {
  render(<AnchorNav items={items} />)
  for (const it of items) {
    const link = screen.getByRole('link', { name: it.label })
    expect(link).toHaveAttribute('href', `#${it.id}`)
  }
  expect(screen.getAllByRole('link')).toHaveLength(2)
})

test('nav has accessible name "On this page"', () => {
  render(<AnchorNav items={items} />)
  expect(screen.getByRole('navigation', { name: /on this page/i })).toBeInTheDocument()
})

test('falls back to first item as current without IntersectionObserver', () => {
  render(<AnchorNav items={items} />)
  expect(screen.getByRole('link', { name: 'One' })).toHaveAttribute('aria-current', 'location')
  expect(screen.getByRole('link', { name: 'Two' })).not.toHaveAttribute('aria-current')
})
