import { useEffect, useRef, useState } from 'react'

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
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">{label}</p>
      )}
      <div className="flex items-center gap-2 rounded border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-2">
        <code
          ref={codeRef}
          className="flex-1 overflow-x-auto whitespace-pre font-mono text-sm text-[var(--color-text-primary)]"
        >
          {command}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={label ? `Copy command: ${label}` : 'Copy command'}
          className="shrink-0 rounded border border-[var(--color-border-default)] px-3 py-1 text-sm text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
        >
          <span aria-hidden="true">Copy</span>
        </button>
      </div>
      {state === 'fallback' && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Press Cmd/Ctrl+C to copy
        </p>
      )}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {state === 'copied' ? 'Copied' : ''}
      </span>
    </div>
  )
}
