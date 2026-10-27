import { expect, test } from 'vitest'
import { guideContextPlugin } from '../vite-plugin-guide-context'
import { buildClaudePrompt } from '../src/lib/claude-prompt'

test('the build emits the same text the copy button copies, instruction included', () => {
  const emitted: { fileName: string; source: string }[] = []
  const plugin = guideContextPlugin()
  const hook = plugin.generateBundle as (this: { emitFile: (f: never) => void }) => void
  hook.call({ emitFile: ((f: { fileName: string; source: string }) => emitted.push(f)) as never })
  expect(emitted).toEqual([
    { type: 'asset', fileName: 'bootstrap-guide-context.md', source: buildClaudePrompt() },
  ])
  expect(emitted[0].source).toContain('INSTRUKTION TILL AI-ASSISTENTEN')
})
