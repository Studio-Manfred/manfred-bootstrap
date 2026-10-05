import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { INSTALL_URL } from '../lib/install'

export const ANCHOR_ID = 'examples'

const EXAMPLES: { id: string; title: string; lede: React.ReactNode; command: string }[] = [
  {
    id: 'minimal',
    title: 'Minimal — local only',
    lede: 'No GitHub, no Vercel, no Linear. Fastest path.',
    command: `${INSTALL_URL} | bash -s -- new --name acme --prefix STU --dir ./acme --yes`,
  },
  {
    id: 'full',
    title: 'Full provisioning — GitHub + Vercel + Linear',
    lede: 'Creates the GitHub repo, Vercel project, and Linear team in one shot.',
    command: `${INSTALL_URL} | bash -s -- new --name acme --prefix STU --dir ./acme --github --vercel --linear --linear-team STU --yes`,
  },
  {
    id: 'overlay',
    title: 'Overlay — add WoW to an existing repo',
    lede: (
      <>
        Drops <code>.claude/</code>, <code>docs/</code>, and friends into a repo that already exists.
        Non-destructive.
      </>
    ),
    command: `${INSTALL_URL} | bash -s -- overlay --dir ./existing-repo --prefix STU`,
  },
]

export default function Examples() {
  const headingId = 'examples-heading'
  return (
    <VStack as="section" gap={6} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-20">
      <VStack gap={2}>
        <Typography variant="headline2" as="h2" id={headingId}>Examples</Typography>
        <Typography variant="bodySmall">
          Copy, paste, run. Each command bootstraps a fresh project in seconds.
        </Typography>
      </VStack>
      {EXAMPLES.map((e) => (
        <article key={e.id} className="rounded-lg border border-[var(--border)] p-4">
          <VStack gap={3}>
            <Typography variant="headline4" as="h3">{e.title}</Typography>
            <Typography variant="bodySmall">{e.lede}</Typography>
            <CommandBlock command={e.command} />
          </VStack>
        </article>
      ))}
    </VStack>
  )
}
