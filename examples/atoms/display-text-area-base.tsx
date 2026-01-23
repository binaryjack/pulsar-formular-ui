/**
 * DisplayTextAreaBase Component
 * Standalone read-only text area display - use anywhere without FormContext
 * Takes value as prop
 */

export interface DisplayTextAreaBaseProps {
  value: string
  label?: string
  rows?: number
  renderMarkdown?: boolean
  className?: string
}

export const DisplayTextAreaBase = ({
  value,
  label,
  rows = 4,
  renderMarkdown = false,
  className = '',
}: DisplayTextAreaBaseProps) => {
  const displayValue = value || ''

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium">{label}</label>}

      {renderMarkdown ? (
        <div
          className="px-3 py-2 border border-gray-200 rounded bg-gray-50 prose prose-sm max-w-none"
          style={{
            minHeight: `${rows * 1.5}rem`,
          }}
        >
          {displayValue || <span className="text-gray-400">No content</span>}
        </div>
      ) : (
        <textarea
          value={displayValue}
          readOnly
          rows={rows}
          aria-label={label}
          className="px-3 py-2 border border-gray-200 rounded bg-gray-50 resize-none cursor-default"
          style={{
            color: '#4b5563',
          }}
        />
      )}
    </div>
  )
}
