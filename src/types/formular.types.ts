/**
 * TypeScript types for formular.dev validation results
 * These types provide type safety when working with validation data
 */

/**
 * Validation result from formular.dev
 */
export interface IValidationResult {
  /** Whether this validation rule passed (true) or failed (false) */
  state: boolean;

  /** Name of the field being validated */
  fieldName: string;

  /** Validation rule code (e.g., 'REQUIRED', 'MIN_LENGTH_ERROR', 'CUSTOM') */
  code: string;

  /** Error message when validation fails (undefined when state is true) */
  error?: string;

  /** Guide/hint message to help user fix the error */
  guide?: string;

  /** Validation strategy name */
  strategy?: string;
}

/**
 * Field error for display in UI components
 */
export interface IFieldError {
  /** Field name */
  name: string;

  /** Error message to display */
  message: string;

  /** Error code for programmatic handling */
  code: string;
}

/**
 * Field guide/hint for display in UI components
 */
export interface IFieldGuide {
  /** Guide message to display */
  message: string;
}
