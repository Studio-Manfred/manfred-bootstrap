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

type View = 'copy' | 'copied'

const COPY_FAILED_TEXT = 'Could not copy. Download the Markdown version and upload it to your chat instead.'
const PASTE_HINT = 'Paste it into the chat with Cmd+V or Ctrl+V.'

// Plain start pages. No prompt in the URL: the prompt is on the clipboard.
const TOOLS = [
  { name: 'Claude', href: 'https://claude.ai/new' },
  { name: 'ChatGPT', href: 'https://chatgpt.com/' },
  { name: 'Gemini', href: 'https://gemini.google.com/app' },
]

// Own component so its state resets each time the dialog closes and reopens.
function GuideDialogBody() {
  const prompt = useMemo(() => buildClaudePrompt(), [])
  const excerpt = useMemo(() => buildPromptExcerpt(prompt), [prompt])
  const [view, setView] = useState<View>('copy')
  const [error, setError] = useState(false)
  const copyRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const focusCopyOnReturn = useRef(false)

  useEffect(() => {
    if (view === 'copied') titleRef.current?.focus()
    else if (focusCopyOnReturn.current) copyRef.current?.focus()
  }, [view])

  async function handleCopy() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(prompt)
      setError(false)
      setView('copied')
    } catch {
      setError(true)
    }
  }

  function handleBack() {
    focusCopyOnReturn.current = true
    setView('copy')
  }

  if (view === 'copied') {
    return (
      <VStack gap={4}>
        <div>
          <Button type="button" variant="ghost" size="sm" aria-label="Back" onClick={handleBack} className="-ml-2 min-h-11 min-w-11">
            <Icon name="chevron-left" size="sm" />
          </Button>
        </div>
        <DialogHeader>
          <DialogTitle ref={titleRef} tabIndex={-1}>
            Prompt copied!
          </DialogTitle>
          <DialogDescription>Choose which service to open it in.</DialogDescription>
        </DialogHeader>
        <VStack gap={3} className="items-stretch">
          {TOOLS.map((tool) => (
            <Button key={tool.name} asChild variant="outline" size="lg" className="w-full">
              <a href={tool.href} target="_blank" rel="noopener noreferrer">
                {tool.name}
                <span className="sr-only"> (opens in a new tab)</span>
                <Icon name="external-link" size="sm" />
              </a>
            </Button>
          ))}
        </VStack>
        <div role="status" aria-live="polite" aria-atomic="true">
          <Typography variant="bodySmall" className="text-center text-[var(--color-text-secondary)]">
            {PASTE_HINT}
          </Typography>
        </div>
      </VStack>
    )
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
      <Button ref={copyRef} type="button" variant="brand" size="lg" onClick={handleCopy} className="w-full">
        Copy the prompt
        <Icon name="arrow-right" size="sm" />
      </Button>
      <div role="status" aria-live="polite" aria-atomic="true" className="empty:hidden">
        {error && <Typography variant="bodySmall">{COPY_FAILED_TEXT}</Typography>}
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
