import { Button, Icon, HStack, Typography, VStack } from '@studio-manfred/manfred-design-system'

export const ANCHOR_ID = 'top'

export default function Hero() {
  const headingId = 'hero-heading'
  return (
    <VStack as="section" gap={6} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32 py-8">
      <Typography variant="headline1" id={headingId}>
        Manfred bootstrap
      </Typography>
      <Typography variant="large">Stamp a Manfred project, hand it to Claude, and start shipping.</Typography>
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
      </HStack>
    </VStack>
  )
}
