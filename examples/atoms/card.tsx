import { HTMLAttributes, ReactNode } from 'react'
import { card, flexBetween, fontSize, spacing } from '../../styles'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: string | ReactNode
  actions?: ReactNode
  children: ReactNode
}

export const Card = ({ title, actions, children, style, ...props }: CardProps) => {
  return (
    <div style={{ ...card(), ...style }} {...props}>
      {title && (
        <div
          style={{
            ...flexBetween(),
            marginBottom: spacing.md,
            paddingBottom: spacing.sm,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {typeof title === 'string' ? (
            <h3 style={{ fontSize: fontSize.base, fontWeight: 600, margin: 0 }}>{title}</h3>
          ) : (
            title
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
