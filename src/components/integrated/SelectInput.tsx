/**
 * SelectInput integrated component
 * Full-featured select with label, errors, and helper text
 *
 * @example
 * ```tsx
 * <SelectInput name="country" label="Select Country" />
 * ```
 */

import type { IFieldError } from '@pulsar-framework/formular.dev';
import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FSelectField } from '../primitives';

/**
 * SelectInput component
 * Integrated select dropdown with label and validation errors
 */
export const SelectInput = ({
  name,
  showLabel = true,
  label,
  showErrors = true,
  showGuides = true,
  helperText,
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
  const hasGuides = showGuides && field.guides && field.guides.length > 0;

  return (
    <div className={`form-field ${className}`} data-field={name}>
      {showLabel && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {displayLabel}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <FSelectField name={name} className={hasErrors ? 'border-red-500' : ''} />

      {hasErrors && (
        <div className="validation-errors mt-1">
          {field.errors?.map((error: IFieldError, index: number) => (
            <p className="text-red-600 text-sm">{error.message}</p>
          ))}
        </div>
      )}

      {hasGuides && (
        <div className="validation-guides mt-1">
          {field.guides?.map((guide: { message: string }, index: number) => (
            <p className="text-blue-600 text-sm">{guide.message}</p>
          ))}
        </div>
      )}

      {helperText && !hasErrors && !hasGuides && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
