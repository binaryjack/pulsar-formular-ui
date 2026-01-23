/**
 * TextArea Component
 * Form-centric text area with debouncing - Only use in FormContext
 */

import { useCallback, useRef } from 'react'
import { useFormContext } from '../form/context/form-provider'
import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { ValidationResults } from './validation-results'

interface TextAreaProps {
  name: string
  label?: string
  rows?: number
  required?: boolean
  placeholder?: string
  disabled?: boolean
  debounceMs?: number
}

export const TextArea = ({
  name,
  label,
  rows = 4,
  required = false,
  placeholder,
  disabled = false,
  debounceMs = 500,
}: TextAreaProps) => {
  const { updateField, preValidateField, model } = useFormContext()
  const fieldValue = useFieldValue(name)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const debounceTimerRef = useRef<number | null>(null)

  const handleUpdate = useCallback(
    (value: unknown) => {
      const validator = preValidateField(name, value)
      if (validator.getIsValid()) {
        updateField(name, value)
      }
    },
    [name, preValidateField, updateField]
  )

  const handleDebouncedUpdate = useCallback(
    (value: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = window.setTimeout(() => {
        handleUpdate(value)
      }, debounceMs)
    },
    [debounceMs, handleUpdate]
  )

  const handleFocus = () => {
    model.setFieldBehavior(name, { isFocus: true })
  }

  const handleBlur = () => {
    // Update with current textarea value on blur
    if (textAreaRef.current) {
      handleUpdate(textAreaRef.current.value)
    }

    // Flush any pending debounced update immediately with current value
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    model.setFieldBehavior(name, {
      isFocus: false,
      hasBeenTouched: true,
    })
    model.validateField(name)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={String(fieldValue ?? '')}
        placeholder={placeholder}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none resize-y"
        onChange={e => handleDebouncedUpdate(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <ValidationResults fieldName={name} />
    </div>
  )
}
