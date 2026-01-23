import { borderRadius, fontSize, spacing } from '../../styles'

interface StatusBadgeProps {
  status: 'ready' | 'needs-tech' | 'draft' | 'active' | 'completed' | 'failed' | 'paused' | 'cancelled'
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyle = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacing.xxxs} ${spacing.xs}`,
      borderRadius: borderRadius.sm,
      fontSize: fontSize.xs,
      fontWeight: 500,
    }

    switch (status) {
      case 'ready':
        return { ...base, backgroundColor: '#dcfce7', color: '#166534' }
      case 'needs-tech':
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }
      case 'draft':
        return { ...base, backgroundColor: '#f3f4f6', color: '#1f2937' }
      case 'active':
        return { ...base, backgroundColor: '#dbeafe', color: '#1e40af' }
      case 'completed':
        return { ...base, backgroundColor: '#dcfce7', color: '#166534' }
      case 'failed':
        return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' }
      case 'paused':
        return { ...base, backgroundColor: '#fef3c7', color: '#92400e' }
      case 'cancelled':
        return { ...base, backgroundColor: '#f3f4f6', color: '#6b7280' }
      default:
        return { ...base, backgroundColor: '#f3f4f6', color: '#1f2937' }
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'ready':
        return 'Ready'
      case 'needs-tech':
        return 'Needs Tech'
      case 'draft':
        return 'Draft'
      case 'active':
        return 'Active'
      case 'completed':
        return 'Completed'
      case 'failed':
        return 'Failed'
      case 'paused':
        return 'Paused'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  return <span style={getStatusStyle()}>{getStatusLabel()}</span>
}
