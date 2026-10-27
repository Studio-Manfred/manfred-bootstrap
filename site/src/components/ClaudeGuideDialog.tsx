import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Icon,
  Typography,
  VStack,
} from '@studio-manfred/manfred-design-system'
import { AiIcon } from './AiIcon'
import { GUIDE_CONTEXT_PATH } from '../content/guide'
import { buildClaudePrompt, buildPromptExcerpt } from '../lib/claude-prompt'

type Status = 'idle' | 'copied' | 'copy-failed'

const STATUS_TEXT: Record<Exclude<Status, 'idle'>, string> = {
  copied: 'Prompt copied. Paste it into any AI chat and send it.',
  'copy-failed': 'Could not copy. Download the Markdown version and upload it to your chat instead.',
}

const COPIED_MS = 3000

// Own component so its state resets each time the dialog closes and reopens.
function GuideDialogBody() {
  const prompt = useMemo(() => buildClaudePrompt(), [])
  const excerpt = useMemo(() => buildPromptExcerpt(prompt), [prompt])
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function handleCopy() {
    window.clearTimeout(timer.current)
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
      setCopied(true)
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS)
    } catch {
      setStatus('copy-failed')
      setCopied(false)
    }
  }

  return (
    <VStack gap={4}>
      <DialogHeader>
        <Typography
          variant="label"
          as="p"
          className="flex items-center gap-2 uppercase tracking-wide text-[var(--color-text-brand)]"
        >
          <AiIcon />
          Prefer a chat?
        </Typography>
        <DialogTitle>Let AI guide you</DialogTitle>
        <DialogDescription>
          Copy the prompt and paste it into any AI chat, for example Claude or ChatGPT. It finds your level and goal,
          then guides you one question at a time.
        </DialogDescription>
      </DialogHeader>
      <div className="rounded-lg bg-[var(--color-bg-subtle)] p-4">
        <span className="sr-only">Start of the prompt: </span>
        <Typography variant="bodySmall" className="line-clamp-4 whitespace-pre-line text-[var(--color-text-secondary)]">
          {excerpt}
        </Typography>
      </div>
      <Button type="button" variant="brand" size="lg" onClick={handleCopy} className="w-full">
        {copied ? 'Copied' : 'Copy the prompt'}
        <Icon name={copied ? 'check' : 'arrow-right'} size="sm" />
      </Button>
      <div role="status" aria-live="polite" aria-atomic="true" className="empty:hidden">
        {status !== 'idle' && <Typography variant="bodySmall">{STATUS_TEXT[status]}</Typography>}
      </div>
      <Typography variant="bodySmall" className="text-center">
        <a
          href={GUIDE_CONTEXT_PATH}
          download="bootstrap-guide-context.md"
          className="inline-flex min-h-6 items-center rounded-sm py-2 text-[var(--color-text-brand)] underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Download Markdown version
        </a>
      </Typography>
      <Typography variant="bodySmall" className="text-center text-[var(--color-text-secondary)]">
        Works in any AI chat. All Bootstrap context comes from this guide.
      </Typography>
    </VStack>
  )
}

export interface ClaudeGuideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The element that opened the dialog. Radix only restores focus for a DialogTrigger, and we have two openers. */
  openerRef: RefObject<HTMLElement | null>
}

export function ClaudeGuideDialog({ open, onOpenChange, openerRef }: ClaudeGuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          openerRef.current?.focus()
        }}
      >
        <GuideDialogBody />
      </DialogContent>
    </Dialog>
  )
}
