import type { MouseEvent } from 'react'
import { Typography } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'claude-guide'

export interface ClaudeGuideLinkProps {
  onOpen: (event: MouseEvent<HTMLElement>) => void
}

// One line in the page flow: the anchor target, and a way in for people who skip the hero button.
export default function ClaudeGuideLink({ onOpen }: ClaudeGuideLinkProps) {
  return (
    <section id={ANCHOR_ID} aria-label="AI guide" className="scroll-mt-32">
      <Typography variant="body">
        Prefer a chat?{' '}
        <button
          type="button"
          onClick={onOpen}
          className="rounded-sm text-[var(--color-text-brand)] underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Open the AI guide
        </button>
      </Typography>
    </section>
  )
}
