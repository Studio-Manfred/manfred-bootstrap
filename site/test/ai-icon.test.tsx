import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { AiIcon } from '../src/components/AiIcon'

test('AiIcon follows the design-system icon style and is hidden from screen readers', () => {
  const { container } = render(<AiIcon />)
  const svg = container.querySelector('svg') as SVGElement
  expect(svg).toHaveAttribute('viewBox', '0 0 24 24')
  expect(svg).toHaveAttribute('fill', 'none')
  expect(svg).toHaveAttribute('stroke', 'currentColor')
  expect(svg).toHaveAttribute('stroke-width', '1.5')
  expect(svg).toHaveAttribute('stroke-linecap', 'round')
  expect(svg).toHaveAttribute('stroke-linejoin', 'round')
  expect(svg).toHaveAttribute('aria-hidden', 'true')
  expect(svg).toHaveAttribute('focusable', 'false')
  expect(svg.querySelectorAll('path')).toHaveLength(1)
})

test('AiIcon is 16 px by default and takes a size', () => {
  const { container, rerender } = render(<AiIcon />)
  expect(container.querySelector('svg')).toHaveAttribute('width', '16')
  rerender(<AiIcon size={24} />)
  expect(container.querySelector('svg')).toHaveAttribute('height', '24')
})
