/**
 * Toggle integrated component
 * Full-featured toggle switch with label and errors
 *
 * @example
 * ```tsx
 * <Toggle name="enableNotifications" label="Enable Notifications" />
 * ```
 */

import type { IFieldError } from '@pulsar-framework/formular.dev';
import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FToggleField } from '../primitives';

/**
 * Toggle component
 * Integrated toggle switch with label and validation errors
 */
export const Toggle = ({
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
        <FToggleField name={name} />
        {displayLabel && <span className="ml-3 text-sm text-gray-700">{displayLabel}</span>}
      </label>

      {hasErrors && (
        <div className="validation-errors mt-1 ml-12">
          {field.errors?.map((error: IFieldError) => (
            <p className="text-red-600 text-sm">{error.message}</p>
          ))}
        </div>
      )}
    </div>
  );
};
