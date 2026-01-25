/**
 * ValidationResults component
 * Field-level validation display with pristine/focus/error logic
 *
 * Display Rules:
 * - isPristine → NO validation displayed
 * - !isPristine && isFocus && isError → Guide ONLY
 * - !isPristine && !isFocus && isError → Error ONLY
 * - !isPristine && !isError → Nothing
 */

import { useFormContext } from '../form-context';
import { ErrorMessage } from './ErrorMessage';
import { GuideMessage } from './GuideMessage';

interface IValidationResultsProps {
  readonly name: string;
}

/**
 * ValidationResults - Displays field validation based on state
 *
 * @example
 * ```tsx
 * <ValidationResults name="email" />
 * ```
 */
export const ValidationResults = ({ name }: IValidationResultsProps): HTMLElement | null => {
  const { getField } = useFormContext();
  const field = getField(name);

  if (!field) {
    return null;
  }

  const hasErrors = field.errors && field.errors.length > 0;
  const hasGuides = field.guides && field.guides.length > 0;

  // Rule: Show errors if present
  if (hasErrors) {
    return (
      <div className="validation-errors" data-field={name}>
        {field.errors?.map((error: string, i: number) => (
          <ErrorMessage key={i} text={error} />
        ))}
      </div>
    );
  }

  // Show guides if present and no errors
  if (hasGuides) {
    return (
      <div className="validation-guides" data-field={name}>
        {field.guides?.map((guide: string, i: number) => (
          <GuideMessage key={i} text={guide} />
        ))}
      </div>
    );
  }

  // No validation messages
  return null;
};
