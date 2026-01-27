/**
 * FieldLabel component
 * Label wrapper with conditional rendering
 *
 * @example
 * ```tsx
 * <FieldLabel
 *   showLabel={true}
 *   label="Email Address"
 *   htmlFor="email-input"
 * />
 * ```
 */

export interface IFieldLabelProps {
  /** Whether to show the label */
  showLabel?: boolean;
  /** Label text to display */
  label?: string;
  /** HTML for attribute (input id) */
  htmlFor?: string;
  /** Optional CSS class name (default: "block text-sm font-medium text-gray-700 mb-1") */
  className?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
}

/**
 * FieldLabel component
 * Wrapper for form field labels with conditional display
 */
export const FieldLabel = ({
  showLabel = true,
  label,
  htmlFor,
  className = 'block text-sm font-medium text-gray-700 mb-1',
  required = false,
}: IFieldLabelProps): HTMLElement | null => {
  if (!showLabel || !label) {
    return null;
  }

  return (
    <label htmlFor={htmlFor} className={className}>
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
  ) as HTMLElement;
};
