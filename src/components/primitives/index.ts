/**
 * Primitive field component exports
 * Basic bindings between Formular fields and Pulsar UI atoms
 */

/**
 * Primitive form field components (F-prefixed)
 * These are atomic components that bind directly to formular.dev fields
 * Each outputs a SINGLE DOM element (input/textarea/select) + skeleton fallback
 */

export { FCheckboxField } from './FCheckboxField';
export { FInputField } from './FInputField';
export { FRadioButton } from './FRadioButton';
export { FSelectField } from './FSelectField';
export { FTextareaField } from './FTextareaField';
export { FToggleField } from './FToggleField';

/**
 * Utility components for field composition
 */
export { FieldValidation } from './ValidationResults';
export type { IFieldValidationProps } from './ValidationResults';

export { HelperText } from './HelperText';
export type { IHelperTextProps } from './HelperText';

export { FieldLabel } from './FieldLabel';
export type { IFieldLabelProps } from './FieldLabel';

// Note: Non-prefixed names (CheckboxField, InputField, etc.) are exported from ./integrated
// to avoid naming conflicts. Use F-prefixed components directly for primitive bindings.
