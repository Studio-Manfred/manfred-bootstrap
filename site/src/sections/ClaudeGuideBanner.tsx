import { useMemo, useState } from 'react'
import { Button, Card, Icon, Typography, VStack } from '@studio-manfred/manfred-design-system'
import { GUIDE_CONTEXT_PATH } from '../content/guide'
import { buildClaudePrompt } from '../lib/claude-prompt'

export const ANCHOR_ID = 'claude-guide'

type Status = 'idle' | 'copied' | 'copy-failed'

const STATUS_TEXT: Record<Exclude<Status, 'idle'>, string> = {
  copied: 'Prompt copied. Paste it into any chat, for example Claude or ChatGPT, and send it.',
  'copy-failed': 'Could not copy. Download the Markdown version and upload it to your chat instead.',
}

// Decorative spark, hidden from screen readers.
function Spark() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
    </svg>
  )
}

export default function ClaudeGuideBanner() {
  const headingId = 'claude-guide-heading'
  const prompt = useMemo(() => buildClaudePrompt(), [])
  const [status, setStatus] = useState<Status>('idle')

  async function handleCopy() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
    } catch {
      setStatus('copy-failed')
    }
  }

  return (
    <section id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Card padding="md" className="border-[var(--color-border-brand)] bg-[var(--color-bg-subtle)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <VStack gap={2} className="min-w-0 sm:max-w-xl">
            <Typography variant="label" className="flex items-center gap-2 uppercase tracking-wide text-[var(--color-text-brand)]">
              <Spark />
              Prefer a chat?
            </Typography>
            <Typography variant="headline3" as="h2" id={headingId}>
              Let AI guide you.
            </Typography>
            <Typography variant="body">
              Copy one prompt, paste it into your chat assistant. It finds your level and goal and guides you, one
              question at a time.
            </Typography>
            <Typography variant="bodySmall" className="hidden text-[var(--color-text-secondary)] sm:block">
              All Bootstrap context comes from this guide.
            </Typography>
          </VStack>
          <VStack gap={3} className="items-stretch sm:shrink-0 sm:items-end">
            <Button type="button" variant="brand" size="lg" onClick={handleCopy} className="w-full sm:w-auto">
              Copy the prompt
              <Icon name={status === 'copied' ? 'check' : 'arrow-right'} size="sm" />
            </Button>
            <Typography variant="bodySmall">
              <a
                href={GUIDE_CONTEXT_PATH}
                download="bootstrap-guide-context.md"
                className="inline-flex min-h-6 items-center rounded-sm py-2 text-[var(--color-text-brand)] underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 sm:py-0"
              >
                Download Markdown version
              </a>
            </Typography>
          </VStack>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-4 empty:mt-0">
          {status !== 'idle' && <Typography variant="bodySmall">{STATUS_TEXT[status]}</Typography>}
        </div>
      </Card>
    </section>
  )
}
