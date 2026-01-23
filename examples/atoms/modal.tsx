import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { flexBetween, fontSize, modalContent, modalOverlay, spacing } from '../../styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string | ReactNode
  children?: ReactNode
  footer?: ReactNode
  maxWidth?: string
}

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = '600px' }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalElement = (
    <div style={modalOverlay} onClick={onClose}>
      <div
        style={{
          ...modalContent(),
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              ...flexBetween(),
              padding: `${spacing.md} ${spacing.lg}`,
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            {typeof title === 'string' ? (
              <h2
                style={{
                  fontSize: fontSize.base,
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                {title}
              </h2>
            ) : (
              title
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: fontSize.lg,
                cursor: 'pointer',
                color: '#6b7280',
                padding: spacing.xs,
              }}
            >
              ×
            </button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            padding: spacing.lg,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: `${spacing.md} ${spacing.lg}`,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: spacing.sm,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalElement, document.body)
}
