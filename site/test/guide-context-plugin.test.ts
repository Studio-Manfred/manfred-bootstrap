import { expect, test } from 'vitest'
import { guideContextPlugin } from '../vite-plugin-guide-context'
import { buildGuideContext } from '../src/lib/guide-context'

test('the build emits bootstrap-guide-context.md with the same text the prompt uses', () => {
  const emitted: { fileName: string; source: string }[] = []
  const plugin = guideContextPlugin()
  const hook = plugin.generateBundle as (this: { emitFile: (f: never) => void }) => void
  hook.call({ emitFile: ((f: { fileName: string; source: string }) => emitted.push(f)) as never })
  expect(emitted).toEqual([
    { type: 'asset', fileName: 'bootstrap-guide-context.md', source: buildGuideContext() },
  ])
})
