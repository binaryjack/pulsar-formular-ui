/**
 * Sample FormInput Component
 * A basic text input component using Pulsar and formular.dev
 */

import type { FormInputProps } from '../types';

interface FormInputComponentProps extends FormInputProps {
  id?: string;
  class?: string;
}

export function FormInput(props: FormInputComponentProps) {
  const {
    name,
    label,
    placeholder,
    required = false,
    disabled = false,
    error,
    helperText,
    type = 'text',
    value = '',
    onChange,
    id,
    class: className = ''
  } = props;

  const inputId = id || `input-${name}`;
  const hasError = !!error;

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    onChange?.(target.value);
  };

  return (
    <div class={`form-group ${className}`}>
      {label && (
        <label 
          for={inputId}
          class={required ? 'form-label-required' : ''}
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onInput={handleInput}
        class={hasError ? 'border-red-500' : ''}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${inputId}-error` : 
          helperText ? `${inputId}-helper` : 
          undefined
        }
      />

      {error && (
        <div id={`${inputId}-error`} class="form-error" role="alert">
          {error}
        </div>
      )}

      {!error && helperText && (
        <div id={`${inputId}-helper`} class="form-helper">
          {helperText}
        </div>
      )}
    </div>
  );
}
