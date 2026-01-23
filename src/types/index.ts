/**
 * Type definitions for form components
 */

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
