import type { Plugin } from 'vite'
import { GUIDE_CONTEXT_PATH } from './src/content/guide'
import { buildGuideContext } from './src/lib/guide-context'

/** Serves/emits the Markdown snapshot (STU-1188). Same builder as the Claude prompt, so there is one source. */
export function guideContextPlugin(): Plugin {
  const fileName = GUIDE_CONTEXT_PATH.replace(/^\//, '')
  return {
    name: 'manfred-guide-context',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== GUIDE_CONTEXT_PATH) return next()
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.end(buildGuideContext())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName, source: buildGuideContext() })
    },
  }
}
