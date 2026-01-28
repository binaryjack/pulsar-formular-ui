/**
 * useFieldValidation hook
 * Abstracts validation data gathering from formular.dev fields
 *
 * @example
 * ```tsx
 * const { hasErrors, errors, guides } = useFieldValidation(field);
 *
 * return (
 *   <div>
 *     {hasErrors() && <ErrorList errors={errors()} />}
 *   </div>
 * );
 * ```
 */

import type { IFieldGuide } from '@pulsar-framework/formular.dev';
import { createEffect, useSync } from '@pulsar-framework/pulsar.dev';
import type { IFieldError, IValidationResult } from '../types';

export interface IFieldValidationResult {
  /** Reactive function: returns true if field has validation errors */
  hasErrors: () => boolean;
  /** Reactive function: returns array of error messages */
  errors: () => IFieldError[];
  /** Reactive function: returns array of guide/hint messages */
  guides: () => IFieldGuide[];
  /** Reactive function: returns raw validation results */
  validationResults: () => IValidationResult[];
}

/**
 * Hook to extract and track validation state from formular.dev field
 *
 * @param field - The formular.dev field instance (from form.getField())
 * @returns Reactive functions for validation state
 */
export function useFieldValidation(field: any): IFieldValidationResult {
  const input = field?.input;

  // Bridge formular.dev's validationResults signal to Pulsar using useSync
  const validationResults = useSync<IValidationResult[]>(
    // Subscribe: formular.dev's createEffect tracks the signal
    (notify) => {
      return createEffect(() => {
        // This reads formular.dev's signal and establishes dependency
        (input as any)?._validationResults?.get();
        // When it changes, notify Pulsar
        notify();
      });
    },
    // Snapshot: get current value for Pulsar
    () => (input as any)?._validationResults?.get() || []
  );

  // ✅ PATTERN: Reactive function that checks if field has errors
  const hasErrors = () => {
    const results = validationResults();
    return results.some((r) => r.state === false && r.error);
  };

  // ✅ PATTERN: Reactive function that extracts error messages
  const errors = (): IFieldError[] => {
    const results = validationResults();
    return results
      .filter((result: IValidationResult) => result.state === false && result.error)
      .map(
        (result: IValidationResult) =>
          ({
            name: result.fieldName,
            message: result.error!,
            code: result.code,
          }) as IFieldError
      );
  };

  // ✅ PATTERN: Reactive function that extracts guide messages
  const guides = (): IFieldGuide[] => {
    const results = validationResults();
    return results
      .filter((result: IValidationResult) => result.state === false && result.guide)
      .map(
        (result: IValidationResult) =>
          ({
            message: result.guide!,
          }) as IFieldGuide
      );
  };

  return {
    hasErrors,
    errors,
    guides,
    validationResults,
  };
}
