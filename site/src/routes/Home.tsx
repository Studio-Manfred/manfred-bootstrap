import { AnchorNav } from '../components/AnchorNav'
import Hero from '../sections/Hero'
import QuickStart, { ANCHOR_ID as START_ID } from '../sections/QuickStart'
import Why, { ANCHOR_ID as WHY_ID } from '../sections/Why'
import WhenToUse, { ANCHOR_ID as WHEN_ID } from '../sections/WhenToUse'

const ANCHOR_ITEMS = [
  { id: WHY_ID, label: 'Why' },
  { id: WHEN_ID, label: 'When to use it' },
  { id: START_ID, label: 'Quick start' },
]

export function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <AnchorNav items={ANCHOR_ITEMS} />
      <Hero />
      <Why />
      <WhenToUse />
      <QuickStart />
    </main>
  )
}
