import { VStack } from '@studio-manfred/manfred-design-system'
import { AnchorNav } from '../components/AnchorNav'
import { PathTabs } from '../components/PathTabs'
import Hero from '../sections/Hero'
import QuickStart, { ANCHOR_ID as START_ID } from '../sections/QuickStart'
import Why, { ANCHOR_ID as WHY_ID } from '../sections/Why'
import WhenToUse, { ANCHOR_ID as WHEN_ID } from '../sections/WhenToUse'
import NewProject, { ANCHOR_ID as NEW_ID } from '../sections/NewProject'
import ExistingProject from '../sections/ExistingProject'
import ClaudeSetup, { ANCHOR_ID as CLAUDE_ID } from '../sections/ClaudeSetup'
import NextSteps, { ANCHOR_ID as NEXT_ID } from '../sections/NextSteps'

// No direct 'existing' entry: its panel is hidden unless the tab is active.
const ANCHOR_ITEMS = [
  { id: WHY_ID, label: 'Why' },
  { id: WHEN_ID, label: 'When to use it' },
  { id: START_ID, label: 'Quick start' },
  { id: NEW_ID, label: 'Get started' },
  { id: CLAUDE_ID, label: 'Claude' },
  { id: NEXT_ID, label: 'Next steps' },
]

export function Home() {
  return (
    <VStack gap={12}>
      <AnchorNav items={ANCHOR_ITEMS} />
      <Hero />
      <Why />
      <WhenToUse />
      <QuickStart />
      <PathTabs panels={{ new: <NewProject />, existing: <ExistingProject /> }} />
      <ClaudeSetup />
      <NextSteps />
    </VStack>
  )
}
