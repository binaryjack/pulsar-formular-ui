/**
 * RadioGroup integrated component
 * Full-featured radio group with label and errors
 *
 * @example
 * ```tsx
 * <RadioGroup name="gender" label="Select Gender" />
 * ```
 */

import type { IFieldError } from '@pulsar-framework/formular.dev';
import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FRadioButton } from '../primitives';

/**
 * RadioGroup component
 * Integrated radio button group with label and validation errors
 * Automatically renders all options from field descriptor
 */
export const RadioGroup = ({
  name,
  showLabel = true,
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
      {displayLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {displayLabel}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-2">
        {field.options?.map((option: any) => (
          <FRadioButton name={name} value={option.value} label={option.label} />
        ))}
      </div>

      {hasErrors && (
        <div className="validation-errors mt-1">
          {field.errors?.map((error: IFieldError, index: number) => (
            <p className="text-red-600 text-sm">{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
