import { render, screen } from '@testing-library/react'
import { PluginCard } from '../src/components/PluginCard'

test('renders slug, pitch, counts, and install command', () => {
  render(
    <PluginCard
      plugin={{ slug: 'manfred-dev', pitch: 'Pre-merge QA + deploy', skills: 3, commands: 0, group: 'engineering' }}
    />,
  )
  expect(screen.getByRole('heading', { level: 3, name: 'manfred-dev' })).toBeInTheDocument()
  expect(screen.getByText(/pre-merge qa/i)).toBeInTheDocument()
  expect(screen.getByText(/3 skills/i)).toBeInTheDocument()
  expect(screen.getByText('/plugin install manfred-dev@manfred')).toBeInTheDocument()
})
