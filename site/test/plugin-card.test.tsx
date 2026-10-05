import { render, screen } from '@testing-library/react'
import { PluginCard } from '../src/components/PluginCard'

test('renders slug, pitch, skills, and install command; no Commands label when empty', () => {
  render(
    <PluginCard
      plugin={{
        slug: 'manfred-dev',
        pitch: 'Pre-merge QA + deploy',
        skills: ['test-my-code', 'deploy'],
        commands: [],
        group: 'engineering',
      }}
    />,
  )
  expect(screen.getByRole('heading', { level: 3, name: 'manfred-dev' })).toBeInTheDocument()
  expect(screen.getByText(/pre-merge qa/i)).toBeInTheDocument()
  expect(screen.getByText('Skills')).toBeInTheDocument()
  expect(screen.getByText('test-my-code')).toBeInTheDocument()
  expect(screen.getByText('deploy')).toBeInTheDocument()
  expect(screen.queryByText('Commands')).not.toBeInTheDocument()
  expect(screen.getByText('/plugin install manfred-dev@manfred')).toBeInTheDocument()
})

test('renders commands with slash prefix when present', () => {
  render(
    <PluginCard
      plugin={{
        slug: 'manfred-discovery',
        pitch: 'Discovery',
        skills: ['cagan-risks'],
        commands: ['/kickoff', '/weekly'],
        group: 'design',
      }}
    />,
  )
  expect(screen.getByText('Commands')).toBeInTheDocument()
  expect(screen.getByText('/kickoff')).toBeInTheDocument()
  expect(screen.getByText('/weekly')).toBeInTheDocument()
})

test('omits Skills label when there are no skills', () => {
  render(
    <PluginCard plugin={{ slug: 'x', pitch: 'p', skills: [], commands: ['/a'], group: 'design' }} />,
  )
  expect(screen.queryByText('Skills')).not.toBeInTheDocument()
})
