import { useEffect, useRef, useState } from 'react'
import { Button, Icon, Typography } from '@studio-manfred/manfred-design-system'

type CopyState = 'idle' | 'copied' | 'fallback'

const REVERT_MS = 2000

export interface CommandBlockProps {
  command: string
  label?: string
}

export function CommandBlock({ command, label }: CommandBlockProps) {
  const [state, setState] = useState<CopyState>('idle')
  const codeRef = useRef<HTMLElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function selectCommand() {
    const node = codeRef.current
    const selection = window.getSelection?.()
    if (!node || !selection) return
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  async function handleCopy() {
    window.clearTimeout(timer.current)
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(command)
      setState('copied')
      timer.current = window.setTimeout(() => setState('idle'), REVERT_MS)
    } catch {
      selectCommand()
      setState('fallback')
    }
  }

  return (
    <div className="my-4">
      {label && (
        <Typography variant="bodySmall" className="mb-1">
          {label}
        </Typography>
      )}
      <div className="flex items-center gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-2">
        <code
          ref={codeRef}
          className="min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-sm text-[var(--color-text-primary)]"
        >
          {command}
        </code>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          aria-label={label ? `Copy command: ${label}` : 'Copy command'}
          className="shrink-0"
        >
          <span aria-hidden="true" className="inline-flex items-center gap-1">
            <Icon name={state === 'copied' ? 'check' : 'chevron-right'} size="sm" />
            Copy
          </span>
        </Button>
      </div>
      {state === 'fallback' && (
        <Typography variant="bodySmall" className="mt-1">
          Press Cmd/Ctrl+C to copy
        </Typography>
      )}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {state === 'copied' ? 'Copied' : ''}
      </span>
    </div>
  )
}
