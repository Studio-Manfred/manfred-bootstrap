import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './index.css'
import { applyTheme, readStoredTheme } from './lib/theme'

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found')

// Apply before first render so there is no flash of the wrong theme.
applyTheme(readStoredTheme())

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
