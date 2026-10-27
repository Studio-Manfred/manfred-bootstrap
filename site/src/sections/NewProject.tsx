import { CommandBlock } from '../components/CommandBlock'
import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { Inline } from '../components/Inline'
import { NEW_PROJECT } from '../content/guide'

export const ANCHOR_ID = 'new'

export default function NewProject() {
  const headingId = 'new-heading'
  return (
    <VStack as="section" gap={4} id={ANCHOR_ID} aria-labelledby={headingId} className="scroll-mt-32">
      <Typography variant="headline2" as="h2" id={headingId}>Path A — New project</Typography>
      <CommandBlock command={NEW_PROJECT.command} />
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Provisioning flags</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-[var(--border)] p-2">Flag</th>
            <th scope="col" className="border-b border-[var(--border)] p-2">What it does</th>
          </tr>
        </thead>
        <tbody>
          {NEW_PROJECT.flags.map((f) => (
            <tr key={f.flag}>
              <th scope="row" className="border-b border-[var(--border)] p-2">
                <code>{f.flag}</code>
              </th>
              <td className="border-b border-[var(--border)] p-2">{f.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Typography variant="headline3" as="h3">What ships</Typography>
      <ul className="list-disc space-y-1 pl-6">
        {NEW_PROJECT.ships.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Typography variant="body">
        <Inline text={NEW_PROJECT.after} />
      </Typography>
      <Typography variant="bodySmall">Prefer a local clone?</Typography>
      <CommandBlock command={NEW_PROJECT.cloneCommand} />
    </VStack>
  )
}
