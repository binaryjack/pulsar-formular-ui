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

import type { IIntegratedFieldProps } from '../../types';
import { useFormContext } from '../form-context';
import { FieldLabel, FieldValidation, FInputField, HelperText } from '../primitives';

/**
 * TextField component
 * Integrated text input with label, validation errors, and guides
 *
 * Composition pattern: Combines primitives for full-featured field
 * - FieldLabel: Conditional label display
 * - FInputField: Core input with formular.dev binding
 * - FieldValidation: Error and guide messages
 * - HelperText: Supplementary help text
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

  return (
    <div className={`form-field ${className}`} data-field={name}>
      <FieldLabel showLabel={showLabel} label={displayLabel} htmlFor={`${input?.id}`} />
      <FInputField name={name} className="" />
      <FieldValidation fieldName={name} showErrors={showErrors} showGuides={showGuides} />
      <HelperText helperText={helperText} />
    </div>
  ) as HTMLElement;
};
