/**
 * ValidationResults component
 * Displays validation errors and guides for a field
 *
 * @example
 * ```tsx
 * <ValidationResults
 *   fieldName="email"
 *   showErrors={true}
 *   showGuides={true}
 * />
 * ```
 */

import { useFieldValidation } from '../../hooks/useFieldValidation';
import type { IFieldError } from '../../types';
import { useFormContext } from '../form-context';

export interface IValidationResultsProps {
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
 * ValidationResults component
 * Encapsulates error and guide display logic
 */
export const ValidationResults = ({
  fieldName,
  showErrors = true,
  showGuides = true,
  errorsClassName = 'validation-errors mt-1',
  guidesClassName = 'validation-guides mt-1',
}: IValidationResultsProps): HTMLElement | null => {
  const formContext = useFormContext();
  const field = formContext.getField(fieldName);

  if (!field) {
    console.warn(`[ValidationResults] Field "${fieldName}" not found`);
    return null;
  }

  // Use the validation hook to get reactive validation state
  const { hasErrors, errors, guides } = useFieldValidation(field);

  return (
    <>
      {showErrors && hasErrors() && (
        <div className={errorsClassName}>
          {errors().map((error: IFieldError) => (
            <p key={error.message} className="text-red-600 text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}

      {showGuides && hasErrors() && (
        <div className={guidesClassName}>
          {guides().map((guide: { message: string }) => (
            <p key={guide.message} className="text-blue-600 text-sm">
              {guide.message}
            </p>
          ))}
        </div>
      )}
    </>
  ) as HTMLElement | null;
};
