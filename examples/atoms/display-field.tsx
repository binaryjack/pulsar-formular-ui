/**
 * DisplayField Component
 * Form-centric read-only field display - Only use in FormContext
 * For standalone usage without forms, use DisplayText instead
 * Used for system-managed fields like ID, timestamps, etc.
 */

import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { DisplayText } from './display-text'

export interface DisplayFieldProps {
  name: string
  label: string
  format?: string
}

export const DisplayField = ({ label, name, format }: DisplayFieldProps) => {
  const fieldValue = String(useFieldValue(name) ?? '-')
  return <DisplayText label={label} value={fieldValue} format={format} />
}
