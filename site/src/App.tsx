import { Route, Routes } from 'react-router-dom'
import { SkipToContent } from './components/SkipToContent'
import { ThemeToggle } from './components/ThemeToggle'
import { Home } from './routes/Home'
import { Plugins } from './routes/Plugins'

// The router (BrowserRouter) is mounted in main.tsx so tests can supply MemoryRouter.
export function App() {
  return (
    <>
      <SkipToContent />
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plugins" element={<Plugins />} />
      </Routes>
    </>
  )
}
