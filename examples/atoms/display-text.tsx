/**
 * Display Text Component
 * Agnostic read-only text display without form context dependency
 * Used for displaying computed values or props-based content
 */

export interface DisplayTextProps {
  label: string
  value: string | number | null | undefined
  className?: string
  format?: string
}
//** COPILOT TODO: create a function that renders a string in a given format
//  <div className="display-text__value">{formatString(displayValue,format)}</div>
//
export const DisplayText = ({ label, value, className = '', format: _format }: DisplayTextProps) => {
  const displayValue = value ?? '-'

  return (
    <div className={`display-text ${className}`}>
      <label className="display-text__label">{label}</label>
      <div className="display-text__value">{displayValue}</div>
    </div>
  )
}
