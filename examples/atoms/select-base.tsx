/**
 * SelectBase Component
 * Standalone select dropdown - use anywhere without FormContext
 * Takes value and onChange as props
 */

import { useRef } from 'react'
import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { SelectOption } from './select-option'
import { SelectOptions } from './select-options'

export interface SelectBaseProps extends Partial<React.ComponentProps<'select'>> {
  options: SelectOption[]
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export const SelectBase = ({
  options,
  name,
  label,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className = '',
  ...rest
}: SelectBaseProps) => {
  // console.log('[!!!---SelectBase ]', options.length)

  const selectRef = useRef<HTMLSelectElement>(null)

  const value = useFieldValue(name)

  // console.log('[!!!---SelectBase & useFieldValue.value ]', options.length, value, options)

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={selectRef}
        value={String(value) ?? ''}
        disabled={disabled}
        aria-label={label || placeholder}
        className={`px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed  ' : ''} ${className}`}
        {...rest}
      >
        <SelectOptions options={options} placeholder={placeholder} />
      </select>
    </div>
  )
}
