import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
} from '@studio-manfred/manfred-design-system'
import type { Plugin } from '../content/plugins'
import { CommandBlock } from './CommandBlock'

export interface PluginCardProps {
  plugin: Plugin
}

export function PluginCard({ plugin }: PluginCardProps) {
  return (
    <Card as="article" padding="md" data-testid="plugin-card">
      <CardHeader>
        <CardTitle className="font-mono">{plugin.slug}</CardTitle>
        <CardDescription>{plugin.pitch}</CardDescription>
      </CardHeader>
      <CardContent>
        <HStack gap={2} wrap>
          <Badge variant="neutral">{plugin.skills} skills</Badge>
          <Badge variant="neutral">{plugin.commands} commands</Badge>
        </HStack>
        <CommandBlock command={`/plugin install ${plugin.slug}@manfred`} />
      </CardContent>
    </Card>
  )
}
