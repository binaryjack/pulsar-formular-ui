/**
 * Form context type definitions
 * Defines the shape of the FormContext provider value
 */

import type { IExtendedInput, IFieldError, IFormular } from '@pulsar-framework/formular.dev';

/**
 * Form context interface
 * Provides access to form operations and field instances
 *
 * @template T - The shape of the form data
 */
export interface IFormContext<T extends object> {
  /** The form instance */
  readonly form: IFormular<T>;

  /**
   * Update a field's value
   * @param fieldName - Name of the field to update
   * @param value - New value for the field
   */
  updateField: (fieldName: string, value: unknown) => void;

  /**
   * Clear a field's value (reset to default)
   * @param fieldName - Name of the field to clear
   */
  clearField: (fieldName: string) => void;

  /**
   * Reset the entire form to its default state
   */
  reset: () => void;

  /**
   * Get a field instance by name
   * @param fieldName - Name of the field to retrieve
   * @returns The field instance or undefined
   */
  getField: (fieldName: string) => IExtendedInput | undefined;

  /**
   * Validate a single field
   * @param fieldName - Name of the field to validate
   */
  validateField: (fieldName: string) => void;

  /**
   * Pre-validate a field (before blur/change)
   * @param fieldName - Name of the field to pre-validate
   * @returns Whether pre-validation passed
   */
  preValidateField: (fieldName: string) => boolean;

  /**
   * Validate the entire form
   * @returns Promise resolving to whether the form is valid
   */
  validateForm: () => Promise<boolean>;

  /**
   * Get all form errors
   * @returns Object mapping field names to their error arrays
   */
  getErrors: () => Record<string, IFieldError[]>;
}
