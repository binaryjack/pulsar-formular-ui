import { borderRadius, fontSize, spacing } from '../../styles'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  const getVariantStyle = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacing.xxxs} ${spacing.xs}`,
      borderRadius: borderRadius.sm,
      fontSize: fontSize.xs,
      fontWeight: 500,
    }

    switch (variant) {
      case 'success':
        return { ...base, backgroundColor: '#dcfce7', color: '#166534' }
      case 'warning':
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }
      case 'error':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' }
      case 'info':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' }
      default:
        return { ...base, backgroundColor: '#f3f4f6', color: '#1f2937' }
    }
  }

  return <span style={getVariantStyle()}>{children}</span>
}
