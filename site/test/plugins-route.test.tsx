import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../src/App'

function renderPlugins() {
  render(
    <MemoryRouter initialEntries={['/plugins']}>
      <App />
    </MemoryRouter>,
  )
}

test('renders all 11 plugin cards', () => {
  renderPlugins()
  expect(screen.getAllByTestId('plugin-card')).toHaveLength(11)
})

test.each(['design', 'engineering', 'knowledge'])('has a %s group region', (name) => {
  renderPlugins()
  expect(screen.getByRole('region', { name: new RegExp(name, 'i') })).toBeInTheDocument()
})
