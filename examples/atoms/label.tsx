/**
 * Label Component
 * Consistent styling for form labels with optional required indicator
 */

import React from 'react'

interface LabelProps {
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const Label = ({ htmlFor, required = false, children, className = '' }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-[var(--text-primary)] mb-1 ${className}`}>
      {children}
      {required && <span className="text-[var(--error-color,#f14c4c)] ml-1">*</span>}
    </label>
  )
}
