/**
 * CheckboxBase Component
 * Standalone checkbox - use anywhere without FormContext
 */

export interface CheckboxBaseProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const CheckboxBase = ({ checked, onChange, label, disabled = false, className = '' }: CheckboxBaseProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={label}
        className="w-4 h-4 rounded border-gray-300"
      />
      {label && <label className="text-sm">{label}</label>}
    </div>
  )
}
