import { cn } from '@/lib/utils'

export function Greeting({ name, className }: { name: string; className?: string }) {
  return (
    <h1 className={cn('text-2xl font-semibold tracking-tight', className)}>
      Hello, {name}
    </h1>
  )
}
