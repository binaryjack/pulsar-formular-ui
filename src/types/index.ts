/**
 * Type definitions for form components
 */

// Re-export formular.dev types for convenience
export type { IFieldError, IFieldGuide, IValidationResult } from './formular.types';

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface FormInputProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value?: string;
  onChange?: (value: string) => void;
}

export interface FormSelectProps extends FormFieldProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export interface FormCheckboxProps extends Omit<FormFieldProps, 'placeholder'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface FormRadioProps extends Omit<FormFieldProps, 'placeholder'> {
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
}

export interface FormGroupProps {
  children: any;
  className?: string;
}

export interface FormProps {
  onSubmit?: (data: Record<string, any>) => void;
  children: any;
  className?: string;
}

/**
 * Integrated field component props
 * For components that include label, validation, etc.
 */
export interface IIntegratedFieldProps {
  /** Field name (must match field descriptor) */
  readonly name: string;
  /** Optional CSS class name */
  readonly className?: string;
  /** Optional helper text */
  readonly helperText?: string;
  /** Label override (defaults to field.label) */
  readonly label?: string;
  /** Whether to show the label (default: true) */
  readonly showLabel?: boolean;
  /** Whether to show validation errors (default: true) */
  readonly showErrors?: boolean;
  /** Whether to show validation guides (default: true) */
  readonly showGuides?: boolean;
}

// Export new type definitions
export * from './field-component.type';
export * from './field-descriptor-config.type';
export * from './form-context.type';
export * from './form-provider.type';
export * from './portal.type';
