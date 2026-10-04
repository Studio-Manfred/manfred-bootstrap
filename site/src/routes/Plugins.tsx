import { PluginCard } from '../components/PluginCard'
import { PLUGINS, type Plugin } from '../content/plugins'

const GROUPS: { slug: Plugin['group']; title: string }[] = [
  { slug: 'design', title: 'Design' },
  { slug: 'engineering', title: 'Engineering' },
  { slug: 'knowledge', title: 'Knowledge' },
]

export function Plugins() {
  return (
    <main id="main" tabIndex={-1}>
      <h1>Plugins</h1>
      <p>Install only what you need. Each plugin is one command.</p>
      {GROUPS.map(({ slug, title }) => (
        <section key={slug} aria-labelledby={`group-${slug}`}>
          <h2 id={`group-${slug}`}>{title}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLUGINS.filter((p) => p.group === slug).map((p) => (
              <PluginCard key={p.slug} plugin={p} />
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
