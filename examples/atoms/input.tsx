/**
 * Input Component
 * Form-centric input field with debouncing - Only use in FormContext
 */

import { useCallback, useEffect, useRef } from 'react'
import { useFormContext } from '../form/context/form-provider'
import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { ValidationResults } from './validation-results'

interface InputProps {
  name: string
  label?: string
  type?: 'text' | 'email' | 'number' | 'password' | 'url' | 'tel'
  required?: boolean
  placeholder?: string
  disabled?: boolean
  debounceMs?: number
}

export const Input = ({
  name,
  label,
  type = 'text',
  required = false,
  placeholder,
  disabled = false,
  debounceMs = 150,
}: InputProps) => {
  const { updateField, preValidateField, model } = useFormContext()
  const fieldValue = useFieldValue(name)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<number | null>(null)

  // Sync input when fieldValue changes externally (not from user typing)
  useEffect(() => {
    if (inputRef.current && inputRef.current !== document.activeElement) {
      inputRef.current.value = String(fieldValue ?? '')
    }
  }, [fieldValue])

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
    // Flush any pending debounced update immediately
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

      <input
        ref={inputRef}
        id={name}
        name={name}
        type={type}
        defaultValue={String(fieldValue ?? '')}
        placeholder={placeholder}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
        onChange={e => handleDebouncedUpdate(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      <ValidationResults fieldName={name} />
    </div>
  )
}
