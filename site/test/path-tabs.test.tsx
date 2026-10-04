import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import { PathTabs } from '../src/components/PathTabs'

const panels = { new: <div>N</div>, existing: <div>E</div> }

beforeEach(() => {
  window.location.hash = ''
})

test('selecting Existing updates URL hash to #existing and shows its panel', async () => {
  render(<PathTabs panels={panels} />)
  await userEvent.click(screen.getByRole('tab', { name: /existing/i }))
  expect(window.location.hash).toBe('#existing')
  expect(screen.getByText('E')).toBeVisible()
  expect(screen.getByText('N')).not.toBeVisible()
})

test('ArrowRight moves focus and selection to next tab', async () => {
  render(<PathTabs panels={panels} />)
  screen.getByRole('tab', { name: /new project/i }).focus()
  await userEvent.keyboard('{ArrowRight}')
  const existing = screen.getByRole('tab', { name: /existing/i })
  expect(existing).toHaveFocus()
  expect(existing).toHaveAttribute('aria-selected', 'true')
})

test('initial tab comes from the hash', () => {
  window.location.hash = '#existing'
  render(<PathTabs panels={panels} />)
  expect(screen.getByRole('tab', { name: /existing/i })).toHaveAttribute('aria-selected', 'true')
})

test('both panels stay mounted, inactive one hidden', () => {
  render(<PathTabs panels={panels} />)
  expect(screen.getByText('E', { selector: 'div' }).closest('[role=tabpanel]')).toHaveAttribute('hidden')
})
