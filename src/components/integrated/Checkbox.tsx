/**
 * Checkbox integrated component
 * Full-featured checkbox with label and errors
 *
 * @example
 * ```tsx
 * <Checkbox name="agreeToTerms" label="I agree to the terms" />
 * ```
 */

import type { IFieldError } from '@pulsar-framework/formular.dev';
import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FCheckboxField } from '../primitives';

/**
 * Checkbox component
 * Integrated checkbox with label and validation errors
 */
export const Checkbox = ({
  name,
  label,
  showErrors = true,
  className = '',
}: IIntegratedFieldProps): HTMLElement => {
  const { getField } = useFormContext();
  const field = getField(name);

  if (!field) {
    console.warn(`Field "${name}" not found in form`);
    return <div data-field-error>{`Field "${name}" not found`}</div>;
  }

  const displayLabel = label || field.label;
  const hasErrors = showErrors && field.errors && field.errors.length > 0;

  return (
    <div className={`form-field ${className}`} data-field={name}>
      <label className="inline-flex items-center cursor-pointer">
        <FCheckboxField name={name} />
        {displayLabel && <span className="ml-2 text-sm text-gray-700">{displayLabel}</span>}
      </label>

      {hasErrors && (
        <div className="validation-errors mt-1 ml-6">
          {field?.errors?.map((error: IFieldError) => (
            <p className="text-red-600 text-sm">{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
