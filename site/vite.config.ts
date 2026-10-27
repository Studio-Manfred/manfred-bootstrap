import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { guideContextPlugin } from './vite-plugin-guide-context'

export default defineConfig({
  plugins: [react(), tailwindcss(), guideContextPlugin()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
