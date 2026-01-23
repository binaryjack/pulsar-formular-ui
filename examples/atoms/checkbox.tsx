/**
 * Checkbox Component
 * Form-centric checkbox - Only use in FormContext
 * For standalone usage without forms, use CheckboxBase instead
 */

import { useFormContext } from '../form/context/form-provider'
import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { CheckboxBase } from './checkbox-base'
import { ValidationResults } from './validation-results'

interface CheckboxProps {
  name: string
  label?: string
  disabled?: boolean
}

export const Checkbox = ({ name, label, disabled = false }: CheckboxProps) => {
  const { updateField, model } = useFormContext()
  const fieldValue = useFieldValue(name)
  const checked = Boolean(fieldValue)

  const handleChange = (value: boolean) => {
    updateField(name, value)
  }

  const handleFocus = () => {
    model.setFieldBehavior(name, { isFocus: true })
  }

  const handleBlur = () => {
    model.setFieldBehavior(name, {
      isFocus: false,
      hasBeenTouched: true,
    })
    model.validateField(name)
  }

  return (
    <div onFocus={handleFocus} onBlur={handleBlur}>
      <CheckboxBase checked={checked} onChange={handleChange} label={label} disabled={disabled} />
      <ValidationResults fieldName={name} />
    </div>
  )
}
