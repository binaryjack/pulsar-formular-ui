/**
 * Example: Advanced TextField using the unified useField hook
 *
 * This demonstrates how the unified hook consolidates ALL field behaviors:
 * - Value management
 * - Validation display
 * - Focus/blur handling
 * - Disabled/required states
 * - Touch tracking
 * - All with just ONE hook call!
 */

import { useField } from '../../hooks/useField';
import { useFormContext } from '../form-context';

export interface IAdvancedTextFieldProps {
  /** Field name from form */
  name: string;
  /** Optional label override (otherwise uses field.label()) */
  label?: string;
  /** Optional placeholder */
  placeholder?: string;
  /** Whether to show validation errors */
  showErrors?: boolean;
  /** Whether to show validation guides */
  showGuides?: boolean;
  /** Optional CSS class */
  className?: string;
}

/**
 * Advanced TextField demonstrating the unified useField hook
 *
 * Shows how ONE hook gives you everything:
 * - Value sync
 * - Validation state
 * - Focus management
 * - Disabled/required handling
 * - Touch tracking
 */
export const AdvancedTextField = ({
  name,
  label: labelOverride,
  placeholder,
  showErrors = true,
  showGuides = true,
  className = '',
}: IAdvancedTextFieldProps): HTMLElement => {
  const formContext = useFormContext();
  const field = formContext.getField(name);

  if (!field) {
    return <div className="text-red-600">Field "{name}" not found</div>;
  }

  // ✅ ONE HOOK TO RULE THEM ALL
  // Get EVERYTHING from formular in a single, optimized hook call
  const {
    // Value management
    value,
    setValue,

    // Validation
    hasErrors,
    errors,
    guides,
    isValid,

    // State
    isDirty,
    isPristine,
    isTouched,
    isFocused,

    // Properties
    isDisabled,
    isRequired,
    label: fieldLabel,
    type,

    // Actions
    focus,
    blur,
    reset,
    touch,
  } = useField(field);

  // Use label from prop or field
  const displayLabel = labelOverride ?? fieldLabel();

  // ==================== EVENT HANDLERS ====================
  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    setValue(input.value);
  };

  const handleFocus = () => {
    // Auto-mark as touched when focused
    if (!isTouched()) {
      touch();
    }
  };

  const handleBlur = () => {
    blur();
    // Mark as touched on blur
    if (!isTouched()) {
      touch();
    }
  };

  const handleReset = () => {
    reset();
  };

  // ==================== DYNAMIC CSS CLASSES ====================
  // Build dynamic classes based on reactive field state
  const inputClasses = () => {
    const classes = ['pulsar-input', className];

    if (hasErrors()) classes.push('input-error');
    if (isValid()) classes.push('input-valid');
    if (isDirty()) classes.push('input-dirty');
    if (isPristine()) classes.push('input-pristine');
    if (isFocused()) classes.push('input-focused');
    if (isTouched()) classes.push('input-touched');
    if (isDisabled()) classes.push('input-disabled');

    return classes.join(' ');
  };

  return (
    <div className="advanced-text-field">
      {/* Label with required indicator */}
      <label className="block mb-2 font-medium">
        {displayLabel}
        {isRequired() && <span className="text-red-500 ml-1">*</span>}

        {/* Status badges */}
        <span className="ml-2 text-xs text-gray-500">
          {isDirty() && <span className="badge-dirty">(modified)</span>}
          {isFocused() && <span className="badge-focused">(focused)</span>}
        </span>
      </label>

      {/* Input with reactive classes and state */}
      <input
        type={type()}
        value={value()}
        oninput={handleInput}
        onfocus={handleFocus}
        onblur={handleBlur}
        placeholder={placeholder}
        disabled={isDisabled()}
        required={isRequired()}
        className={inputClasses()}
        aria-invalid={hasErrors()}
        aria-required={isRequired()}
      />

      {/* Action buttons */}
      <div className="mt-2 flex gap-2">
        <button type="button" onclick={handleReset} disabled={isPristine()} className="btn-reset">
          Reset
        </button>
        <button type="button" onclick={focus} className="btn-focus">
          Focus
        </button>
      </div>

      {/* Validation errors */}
      {showErrors && hasErrors() && (
        <div className="validation-errors mt-2">
          {errors().map((error, index) => (
            <p key={error.message || `error-${index}`} className="text-red-600 text-sm">
              {error.message}
            </p>
          ))}
        </div>
      )}

      {/* Validation guides */}
      {showGuides && guides().length > 0 && (
        <div className="validation-guides mt-2">
          {guides().map((guide, index) => (
            <p key={guide.message || `guide-${index}`} className="text-blue-600 text-sm">
              {guide.message}
            </p>
          ))}
        </div>
      )}

      {/* Debug info (optional - remove in production) */}
      {import.meta.env.DEV && (
        <div className="debug-info mt-2 p-2 bg-gray-100 text-xs">
          <strong>Debug State:</strong>
          <ul>
            <li>Value: {JSON.stringify(value())}</li>
            <li>Valid: {isValid() ? '✓' : '✗'}</li>
            <li>Dirty: {isDirty() ? 'Yes' : 'No'}</li>
            <li>Touched: {isTouched() ? 'Yes' : 'No'}</li>
            <li>Focused: {isFocused() ? 'Yes' : 'No'}</li>
            <li>Disabled: {isDisabled() ? 'Yes' : 'No'}</li>
            <li>Required: {isRequired() ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
