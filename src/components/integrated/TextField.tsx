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
import { createEffect as formularCreateEffect } from 'formular.dev.lib';
import { useSync } from 'pulsar';
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
  const formContext = useFormContext();

  const field = formContext.getField(name);
  const input = field?.input;
  const displayLabel = label || input?.label;

  // Bridge formular.dev's validationResults signal to Pulsar using useSync
  const validationResults = useSync(
    // Subscribe: formular.dev's createEffect tracks the signal
    (notify) => {
      return formularCreateEffect(() => {
        // This reads formular.dev's signal and establishes dependency
        (input as any)._validationResults?.get();
        // When it changes, notify Pulsar
        notify();
      });
    },
    // Snapshot: get current value for Pulsar
    () => (input as any)._validationResults?.get() || []
  );

  const hasErrors = validationResults().length > 0;

  // Extract errors from validation results (now reactive!)
  const errors = (): IFieldError[] => {
    const results = validationResults(); // This reads the Pulsar signal
    return results
      .filter((result: any) => result.state === false && result.errorMessage)
      .map((result: any) => ({
        name: result.name,
        message: result.errorMessage,
        code: result.code,
      }));
  };

  // Extract guides from validation results (now reactive!)
  const guides = () => {
    const results = validationResults(); // This reads the Pulsar signal
    return results
      .filter((result: any) => result.guideMessage)
      .map((result: any) => ({
        message: result.guideMessage,
      }));
  };

  return (
    <div className={`form-field ${className}`} data-field={name}>
      {showLabel && displayLabel && (
        <label htmlFor={`${input?.id}`} className="block text-sm font-medium text-gray-700 mb-1">
          {displayLabel}
        </label>
      )}

      <FInputField name={name} className="" />

      {hasErrors && (
        <div className="validation-errors mt-1">
          {errors().map((error: IFieldError) => (
            <p className="text-red-600 text-sm">{error.message}</p>
          ))}
        </div>
      )}

      {showGuides && (
        <div className="validation-guides mt-1">
          {guides().map((guide: { message: string }) => (
            <p className="text-blue-600 text-sm">{guide.message}</p>
          ))}
        </div>
      )}

      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  ) as HTMLElement;
};
