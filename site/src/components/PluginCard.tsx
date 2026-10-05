import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Typography,
  VStack,
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
        <CardTitle className="font-mono break-words">{plugin.slug}</CardTitle>
        <CardDescription>{plugin.pitch}</CardDescription>
      </CardHeader>
      <CardContent>
        <VStack gap={4}>
          {plugin.skills.length > 0 && (
            <VStack gap={2}>
              <Typography variant="label">Skills</Typography>
              <HStack gap={2} wrap>
                {plugin.skills.map((skill) => (
                  <Badge key={skill} variant="neutral" size="sm" className="font-mono">
                    {skill}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          )}
          {plugin.commands.length > 0 && (
            <VStack gap={2}>
              <Typography variant="label">Commands</Typography>
              <HStack gap={2} wrap>
                {plugin.commands.map((command) => (
                  <Badge key={command} variant="info" size="sm" className="font-mono">
                    {command}
                  </Badge>
                ))}
              </HStack>
            </VStack>
          )}
          <CommandBlock command={`/plugin install ${plugin.slug}@manfred`} />
        </VStack>
      </CardContent>
    </Card>
  )
}
