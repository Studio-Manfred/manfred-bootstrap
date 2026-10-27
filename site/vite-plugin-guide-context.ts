import type { Plugin } from 'vite'
import { GUIDE_CONTEXT_PATH } from './src/content/guide'
import { buildClaudePrompt } from './src/lib/claude-prompt'

/** Serves/emits the downloadable file (STU-1188): the exact text the copy button copies, instruction + guide snapshot. */
export function guideContextPlugin(): Plugin {
  const fileName = GUIDE_CONTEXT_PATH.replace(/^\//, '')
  return {
    name: 'manfred-guide-context',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== GUIDE_CONTEXT_PATH) return next()
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(buildClaudePrompt())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName, source: buildClaudePrompt() })
    },
  }
}
