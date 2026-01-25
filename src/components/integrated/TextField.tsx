/**
 * TextField integrated component
 * Full-featured text input with label, errors, and helper text
 *
 * @example
 * ```tsx
 * <TextField name="username" />
 * <TextField name="email" label="Email Address" showErrors={true} />
 * ```
 */

import type { IFieldError } from 'formular.dev.lib';
import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FInputField } from '../primitives';

/**
 * TextField component
 * Integrated text input with label, validation errors, and guides
 */
export const TextField = ({
  name,
  showLabel = true,
  label,
  showErrors = true,
  showGuides = true,
  helperText,
  className = '',
}: IIntegratedFieldProps): HTMLElement => {
  console.log('[TextField] Calling useFormContext for:', name);
  const formContext = useFormContext();
  console.log('[TextField] useFormContext returned:', formContext);

  if (!formContext) {
    console.error('[TextField] formContext is undefined for field:', name);
    return <div data-field-error>FormContext is undefined</div>;
  }

  const field = formContext.getField(name);

  if (!field) {
    console.warn(`Field "${name}" not found in form`);
    return <div data-field-error>{`Field "${name}" not found`}</div>;
  }

  const input = field.input;
  const displayLabel = label || input.label;
  // validationResults is an array, not an object with errors/guides properties
  const errors = (input.validationResults as any) || [];
  const guides: any[] = []; // Guides not available in current structure
  const hasErrors = showErrors && errors.length > 0;
  const hasGuides = showGuides && guides.length > 0;

  return (
    <div className={`form-field ${className}`} data-field={name}>
      {showLabel && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {displayLabel}
        </label>
      )}

      <FInputField name={name} className={hasErrors ? 'border-red-500' : ''} />

      {hasErrors && (
        <div className="validation-errors mt-1">
          {errors.map((error: IFieldError, index: number) => (
            <p key={index} className="text-red-600 text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}

      {hasGuides && (
        <div className="validation-guides mt-1">
          {guides.map((guide: { message: string }, index: number) => (
            <p key={index} className="text-blue-600 text-sm">
              {guide.message}
            </p>
          ))}
        </div>
      )}

      {helperText && !hasErrors && !hasGuides && (
        <p className="text-gray-500 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
};
