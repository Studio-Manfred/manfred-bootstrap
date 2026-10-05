import { Typography, VStack } from '@studio-manfred/manfred-design-system'
import { PluginCard } from '../components/PluginCard'
import { PLUGINS, type Plugin } from '../content/plugins'

const GROUPS: { slug: Plugin['group']; title: string }[] = [
  { slug: 'design', title: 'Design' },
  { slug: 'engineering', title: 'Engineering' },
  { slug: 'knowledge', title: 'Knowledge' },
]

export function Plugins() {
  return (
    <VStack gap={8}>
      <Typography variant="headline1">Plugins</Typography>
      <Typography variant="large">Install only what you need. Each plugin is one command.</Typography>
      {GROUPS.map(({ slug, title }) => (
        <section key={slug} aria-labelledby={`group-${slug}`}>
          <Typography variant="headline2" as="h2" id={`group-${slug}`} className="mb-4">
            {title}
          </Typography>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLUGINS.filter((p) => p.group === slug).map((p) => (
              <PluginCard key={p.slug} plugin={p} />
            ))}
          </div>
        </section>
      ))}
    </VStack>
  )
}
