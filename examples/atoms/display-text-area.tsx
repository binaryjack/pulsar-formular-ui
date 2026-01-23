/**
 * DisplayTextArea Component
 * Form-centric read-only text area - Only use in FormContext
 * For standalone usage without forms, use DisplayTextAreaBase instead
 */

import { useFieldValue } from '../form/hooks/use-field-value.hook'
import { DisplayTextAreaBase } from './display-text-area-base'

interface DisplayTextAreaProps {
  name: string
  label?: string
  rows?: number
  renderMarkdown?: boolean
}

export const DisplayTextArea = ({ name, label, rows = 4, renderMarkdown = false }: DisplayTextAreaProps) => {
  const fieldValue = String(useFieldValue(name) ?? '')

  return <DisplayTextAreaBase value={fieldValue} label={label} rows={rows} renderMarkdown={renderMarkdown} />
}
