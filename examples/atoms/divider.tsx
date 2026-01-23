/**
 * Divider Component
 * Horizontal or vertical separator with customizable spacing
 */

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

const spacingMap = {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
}

export const Divider = ({ orientation = 'horizontal', spacing = 'md', className = '' }: DividerProps) => {
  const spacingValue = spacingMap[spacing]

  if (orientation === 'vertical') {
    return (
      <div
        className={`border-l border-[var(--border-color,#3e3e42)] ${className}`}
        style={{
          marginLeft: spacingValue,
          marginRight: spacingValue,
          height: '100%',
        }}
      />
    )
  }

  return (
    <div
      className={`border-t border-[var(--border-color,#3e3e42)] ${className}`}
      style={{
        marginTop: spacingValue,
        marginBottom: spacingValue,
        width: '100%',
      }}
    />
  )
}
