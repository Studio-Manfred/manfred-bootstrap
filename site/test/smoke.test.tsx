import { render, screen } from '@testing-library/react'
import { App } from '../src/App'

test('App renders a landmark', () => {
  render(<App />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
