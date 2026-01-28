/**
 * useFormContext hook
 * Provides access to form operations and field instances
 * Must be used within a FormProvider
 */

import { useContext } from '@pulsar-framework/pulsar.dev/context';
import type { IFormContext } from '../../types';
import { FormContext } from './FormContext';

/**
 * Hook for accessing form context
 *
 * @template T - The shape of the form data
 * @returns The form context
 * @throws Error if used outside FormProvider
 *
 * @example
 * ```typescript
 * const { getField, updateField, validateForm } = useFormContext()
 * const usernameField = getField('username')
 * ```
 */
export function useFormContext<T extends object = any>(): IFormContext<T> {
  const context = useContext(FormContext);

  // With signal-based context, the value starts as undefined and updates when Provider executes
  // No need to check - if there's no Provider, the app will fail when trying to use undefined
  // If Provider is coming, the signal will update and components will reactively re-render
  return context!;
}
