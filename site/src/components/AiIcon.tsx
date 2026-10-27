// TODO(STU-1189): replace with <Icon name="sparkles" /> from the design system when it ships.
// Same style as the DS icons: 24 px grid, one stroke path, 1.5 wide, round ends.
const PATH =
  'M10 6l1.7 4.3L16 12l-4.3 1.7L10 18l-1.7-4.3L4 12l4.3-1.7zM18 3.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z'

export interface AiIconProps {
  size?: number
  className?: string
}

export function AiIcon({ size = 16, className }: AiIconProps) {
  return (
    <svg
      data-icon="ai"
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={PATH} />
    </svg>
  )
}
