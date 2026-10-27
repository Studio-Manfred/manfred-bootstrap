import { INTRO } from '../content/guide'
import type { MouseEvent } from 'react'
import { AiIcon } from '../components/AiIcon'
import { Button, Icon, HStack, Typography, VStack } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'top'

export interface HeroProps {
  onOpenGuide?: (event: MouseEvent<HTMLElement>) => void
}

export default function Hero({ onOpenGuide }: HeroProps) {
  const headingId = 'hero-heading'
  return (
    <VStack as="section" gap={6} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32 py-8">
      <Typography variant="headline1" id={headingId}>
        {INTRO.title}
      </Typography>
      <Typography variant="large">{INTRO.tagline}</Typography>
      <HStack gap={3} wrap>
        <Button asChild variant="brand" size="lg">
          <a href="#new">
            Start a new project
            <Icon name="arrow-right" size="sm" />
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#existing">Add to an existing repo</a>
        </Button>
        {onOpenGuide && (
          <Button type="button" variant="outline" size="lg" onClick={onOpenGuide} className="border-[var(--color-border-brand)] text-[var(--color-text-brand)]">
            <AiIcon />
            Let AI guide you
          </Button>
        )}
      </HStack>
    </VStack>
  )
}
