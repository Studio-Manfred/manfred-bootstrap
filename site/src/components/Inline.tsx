import { Fragment } from 'react'

// Renders a string with `backtick` spans as <code>. Content strings stay plain Markdown-ish text.
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split('`').map((part, i) =>
        i % 2 === 1 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  )
}
