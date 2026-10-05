import { Link, Route, Routes, useLocation } from 'react-router-dom'
import {
  Container,
  HStack,
  Logo,
  NavItem,
  PageBody,
  PageFooter,
  PageHeader,
  PageShell,
  Typography,
} from '@studio-manfred/manfred-design-system'
import { ThemeToggle } from './components/ThemeToggle'
import { Home } from './routes/Home'
import { Plugins } from './routes/Plugins'

// The router (BrowserRouter) is mounted in main.tsx so tests can supply MemoryRouter.
export function App() {
  const { pathname } = useLocation()
  return (
    <PageShell>
      <PageHeader>
        <Container size="xl" className="flex h-16 items-center justify-between">
          <Link to="/" aria-label="Manfred home">
            <Logo variant="wordmark" height={24} aria-label="Manfred" />
          </Link>
          <HStack gap={4} align="center">
            <nav aria-label="Primary">
              <NavItem as={Link} to="/plugins" active={pathname === '/plugins'}>
                Plugins
              </NavItem>
            </nav>
            <ThemeToggle />
          </HStack>
        </Container>
      </PageHeader>
      <PageBody tabIndex={-1}>
        <Container size="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plugins" element={<Plugins />} />
          </Routes>
        </Container>
      </PageBody>
      <PageFooter>
        <Container size="xl">
          <Typography variant="bodySmall">
            Internal site. Manfred.{' '}
            <a href="https://github.com/Studio-Manfred/manfred-bootstrap">GitHub repo</a>
          </Typography>
        </Container>
      </PageFooter>
    </PageShell>
  )
}
