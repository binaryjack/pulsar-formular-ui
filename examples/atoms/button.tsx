import { ButtonHTMLAttributes } from 'react'
import { borderRadius, fontSize, spacing, transitions } from '../../styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${spacing.xs} ${spacing.sm}`,
          fontSize: fontSize.xs,
        }
      case 'lg':
        return {
          padding: `${spacing.md} ${spacing.lg}`,
          fontSize: fontSize.base,
        }
      default:
        return {
          padding: `${spacing.sm} ${spacing.md}`,
          fontSize: fontSize.sm,
        }
    }
  }

  const getVariantStyle = () => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      ...getSizeStyle(),
      fontWeight: 500,
      borderRadius: borderRadius.sm,
      transition: `all ${transitions.fast} ease`,
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      opacity: props.disabled ? 0.5 : 1,
      border: 'none',
    }

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: '#3b82f6',
        color: 'white',
      }
    } else if (variant === 'danger') {
      return {
        ...base,
        backgroundColor: 'rgba(220, 38, 38, 0.9)',
        color: 'white',
        border: '1px solid rgba(185, 28, 28, 1)',
      }
    } else if (variant === 'ghost') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: '#6b7280',
        border: 'none',
      }
    } else {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
      }
    }
  }

  return (
    <button
      className={className}
      style={{ ...getVariantStyle(), ...props.style }}
      onMouseEnter={e => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#2563eb'
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        } else if (variant === 'ghost') {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
        }
      }}
      onMouseLeave={e => {
        const style = getVariantStyle()
        e.currentTarget.style.backgroundColor = style.backgroundColor || 'transparent'
      }}
      {...props}
    >
      {children}
    </button>
  )
}
