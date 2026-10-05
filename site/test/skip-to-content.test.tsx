import { render, screen } from '@testing-library/react'
import { SkipToContent } from '../src/components/SkipToContent'

test('SkipToContent renders a link to #main', () => {
  render(<SkipToContent />)
  const link = screen.getByRole('link', { name: /skip to content/i })
  expect(link).toHaveAttribute('href', '#main')
})
