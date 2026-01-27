/**
 * HelperText component
 * Simple helper text display for form fields
 *
 * @example
 * ```tsx
 * <HelperText helperText="Enter your email address" />
 * <HelperText helperText="Must be at least 8 characters" className="text-xs" />
 * ```
 */

export interface IHelperTextProps {
  /** Helper text to display */
  helperText?: string;
  /** Optional CSS class name (default: "text-gray-500 text-sm mt-1") */
  className?: string;
}

/**
 * HelperText component
 * Displays supplementary help text for form fields
 */
export const HelperText = ({
  helperText,
  className = 'text-gray-500 text-sm mt-1',
}: IHelperTextProps): HTMLElement | null => {
  if (!helperText) {
    return null;
  }

  return (<p className={className}>{helperText}</p>) as HTMLElement;
};
