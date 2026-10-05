import type { Plugin } from '../content/plugins'
import { CommandBlock } from './CommandBlock'

export interface PluginCardProps {
  plugin: Plugin
}

export function PluginCard({ plugin }: PluginCardProps) {
  return (
    <article
      data-testid="plugin-card"
      className="rounded border border-[var(--color-border-default)] bg-[var(--color-surface-default)] p-4 text-[var(--color-text-primary)]"
    >
      <h3 className="font-mono text-lg font-semibold">{plugin.slug}</h3>
      <p className="mt-1">{plugin.pitch}</p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        {plugin.skills} skills · {plugin.commands} commands
      </p>
      <CommandBlock command={`/plugin install ${plugin.slug}@manfred`} />
    </article>
  )
}
