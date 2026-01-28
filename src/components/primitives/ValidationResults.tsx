/**
 * FieldValidation component
 * Displays validation errors and guides for a field
 *
 * @example
 * ```tsx
 * <FieldValidation
 *   fieldName="email"
 *   showErrors={true}
 *   showGuides={true}
 * />
 * ```
 */

import { useField } from '../../hooks/useField';
import type { IFieldError } from '../../types';
import { useFormContext } from '../form-context';

export interface IFieldValidationProps {
  /** Field name to display validation for */
  fieldName: string;
  /** Whether to show error messages (default: true) */
  showErrors?: boolean;
  /** Whether to show guide/hint messages (default: true) */
  showGuides?: boolean;
  /** Optional CSS class for errors container */
  errorsClassName?: string;
  /** Optional CSS class for guides container */
  guidesClassName?: string;
}

/**
 * FieldValidation component
 * Encapsulates error and guide display logic
 */
export const FieldValidation = ({
  fieldName,
  showErrors = true,
  showGuides = true,
  errorsClassName = 'validation-errors mt-1',
  guidesClassName = 'validation-guides mt-1',
}: IFieldValidationProps): HTMLElement => {
  const formContext = useFormContext();
  const field = formContext.getField(fieldName);

  // ✅ Use unified hook - gets ALL field state in one place
  const { hasErrors, errors, guides, isFocused } = useField(field);

  return (
    <div className="field-validation-container">
      {showErrors && hasErrors() && !isFocused() && (
        <div className={errorsClassName}>
          {errors().map((error: IFieldError) => (
            <p key={error.code} className="text-red-600 text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}
      {isFocused() && showGuides && (
        <div className={guidesClassName}>
          {guides().map((guide) => (
            <p key={guide.code} className="text-blue-600 text-sm">
              {guide.message}
            </p>
          ))}
        </div>
      )}
    </div>
  ) as HTMLElement;
};
