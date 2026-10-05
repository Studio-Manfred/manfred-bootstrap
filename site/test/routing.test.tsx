import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../src/App'

test('renders Home at /', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { level: 1, name: /manfred bootstrap/i })).toBeInTheDocument()
})

test('renders Plugins at /plugins', () => {
  render(
    <MemoryRouter initialEntries={['/plugins']}>
      <App />
    </MemoryRouter>,
  )
  expect(screen.getByRole('heading', { level: 1, name: /plugins/i })).toBeInTheDocument()
})
