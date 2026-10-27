import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Icon, Typography, VStack } from '@studio-manfred/manfred-design-system'
import { GUIDE_CONTEXT_PATH } from '../content/guide'
import { buildClaudeDeepLink, buildClaudePrompt } from '../lib/claude-prompt'

export const ANCHOR_ID = 'claude-guide'
export const CLAUDE_DOWNLOAD_URL = 'https://claude.ai/download'

type Status = 'idle' | 'opened' | 'copied' | 'copy-failed'

const STATUS_TEXT: Record<Exclude<Status, 'idle'>, string> = {
  opened: 'Händer inget? Claude Desktop behöver vara installerat.',
  copied: 'Instruktionen är kopierad. Klistra in den i en ny chatt i Claude.',
  'copy-failed': 'Kunde inte kopiera. Hämta Markdown-versionen istället och ladda upp den i Claude.',
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
  const href = useMemo(() => buildClaudeDeepLink(prompt), [prompt])
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // The link opens Claude Desktop by itself; we only reveal the fallback help.
  // Nothing is sent: Claude shows the prompt for the user to review.
  function handleOpen() {
    window.clearTimeout(timer.current)
    setStatus('opened')
  }

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
              Hellre i chatformat?
            </Typography>
            <Typography variant="headline3" as="h2" id={headingId}>
              Låt Claude guida dig.
            </Typography>
            <Typography variant="body">
              Claude utgår från Bootstrap-guiden, tar reda på din nivå och ditt mål och hjälper dig vidare — en fråga i
              taget.
            </Typography>
            <Typography variant="bodySmall" className="text-[var(--color-text-secondary)]">
              All Bootstrap-kontext kommer från den här guiden.
            </Typography>
          </VStack>
          <VStack gap={3} className="w-full items-stretch sm:w-auto sm:shrink-0 sm:items-end">
            <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
              <a href={href} onClick={handleOpen}>
                Öppna i Claude Desktop
                <Icon name="arrow-right" size="sm" />
              </a>
            </Button>
            <Typography variant="bodySmall">
              <a href={GUIDE_CONTEXT_PATH} download="bootstrap-guide-context.md">
                Hämta Markdown-version
              </a>
            </Typography>
          </VStack>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-4">
          {status !== 'idle' && (
            <VStack gap={2}>
              <Typography variant="bodySmall">{STATUS_TEXT[status]}</Typography>
              {status !== 'copied' && (
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                    Kopiera instruktionen
                  </Button>
                  <Typography variant="bodySmall">
                    <a href={CLAUDE_DOWNLOAD_URL} target="_blank" rel="noreferrer">
                      Ladda ner Claude Desktop
                    </a>
                  </Typography>
                </div>
              )}
            </VStack>
          )}
        </div>
      </Card>
    </section>
  )
}
