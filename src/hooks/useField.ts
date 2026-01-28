/**
 * useField hook - Unified formular.dev field synchronization
 *
 * This hook consolidates ALL field state reactivity in ONE place for optimal performance.
 * Instead of having multiple hooks (useFieldValidation, useFieldState, useFieldFocus, etc.),
 * this single hook syncs all formular.dev signals to Pulsar reactivity.
 *
 * @example
 * ```tsx
 * const field = formContext.getField('email');
 * const {
 *   value,
 *   setValue,
 *   hasErrors,
 *   errors,
 *   guides,
 *   isValid,
 *   isDirty,
 *   isPristine,
 *   isTouched,
 *   isFocused,
 *   isDisabled,
 *   isRequired,
 *   focus,
 *   blur,
 *   reset,
 * } = useField(field);
 *
 * return (
 *   <input
 *     value={value()}
 *     onInput={(e) => setValue(e.target.value)}
 *     disabled={isDisabled()}
 *     required={isRequired()}
 *   />
 * );
 * ```
 */

import type { IFieldGuide } from '@pulsar-framework/formular.dev';
import { createEffect, useSync } from '@pulsar-framework/pulsar.dev';
import type { IFieldError, IValidationResult } from '../types';

export interface IUseFieldResult {
  // ==================== VALUE MANAGEMENT ====================
  /** Reactive function: returns current field value */
  value: () => any;
  /** Set field value programmatically */
  setValue: (newValue: any) => void;

  // ==================== VALIDATION STATE ====================
  /** Reactive function: returns true if field has validation errors */
  hasErrors: () => boolean;
  /** Reactive function: returns array of error messages */
  errors: () => IFieldError[];
  /** Reactive function: returns array of guide/hint messages */
  guides: () => IFieldGuide[];
  /** Reactive function: returns raw validation results */
  validationResults: () => IValidationResult[];

  // ==================== FIELD STATE ====================
  /** Reactive function: returns true if field passes all validation */
  isValid: () => boolean;
  /** Reactive function: returns true if field has been modified */
  isDirty: () => boolean;
  /** Reactive function: returns true if field is in original state */
  isPristine: () => boolean;
  /** Reactive function: returns true if field has been interacted with */
  isTouched: () => boolean;
  /** Reactive function: returns true if field currently has focus */
  isFocused: () => boolean;

  // ==================== FIELD PROPERTIES ====================
  /** Reactive function: returns true if field is disabled */
  isDisabled: () => boolean;
  /** Reactive function: returns true if field is required */
  isRequired: () => boolean;
  /** Get field label */
  label: () => string;
  /** Get field name */
  name: () => string;
  /** Get field type */
  type: () => string;

  // ==================== FIELD ACTIONS ====================
  /** Focus the field */
  focus: () => void;
  /** Blur the field */
  blur: () => void;
  /** Reset field to default value */
  reset: () => void;
  /** Mark field as touched */
  touch: () => void;
}

/**
 * Hook to sync ALL formular.dev field state to Pulsar reactivity
 *
 * This is the ONE hook to rule them all - consolidates all field behaviors:
 * - Value management
 * - Validation state
 * - User interaction state (touched, focused, dirty)
 * - Field properties (disabled, required)
 * - Field actions (focus, blur, reset)
 *
 * @param field - The formular.dev field instance (from form.getField())
 * @returns Complete reactive field interface
 */
export function useField(field: any): IUseFieldResult {
  if (!field) {
    throw new Error('[useField] Field instance is required');
  }

  const input = field.input;
  const descriptor = field.descriptor;

  // ==================== SYNC VALUE ====================
  const value = useSync<any>(
    (notify) => {
      return createEffect(() => {
        input?._value?.get();
        notify();
      });
    },
    () => input?._value?.get()
  );

  // ==================== SYNC VALIDATION RESULTS ====================
  const validationResults = useSync<IValidationResult[]>(
    (notify) => {
      return createEffect(() => {
        (input as any)?._validationResults?.get();
        notify();
      });
    },
    () => (input as any)?._validationResults?.get() || []
  );

  // ==================== SYNC FIELD STATE FLAGS ====================
  // Note: isValid has a signal (_isValid), but isDirty, isPristine, isFocus are plain properties
  // We sync them using formular's channel-based notification system

  const isValid = useSync<boolean>(
    (notify) => {
      return createEffect(() => {
        input?._isValid?.get();
        notify();
      });
    },
    () => input?._isValid?.get() ?? true
  );

  // For non-signal properties (isDirty, isPristine, isFocus), we subscribe to formular's
  // channel-based notification system. Each field has a channel = String(field.input.id)
  // When formular updates field state, it triggers observers.trigger(channel)
  const fieldStateSnapshot = useSync<{
    isDirty: boolean;
    isPristine: boolean;
    isFocus: boolean;
  }>(
    (notify) => {
      const observers = input?.notificationManager?.observers;
      const channel = input?.id ? String(input.id) : null;

      if (!observers || !channel) {
        return () => {}; // No cleanup if no observers
      }

      // Subscribe to this field's channel - formular triggers this when state changes
      const callback = () => {
        notify(); // Notify Pulsar's reactivity system
      };

      observers.subscribe(channel, callback, false); // false = strong reference

      // Cleanup: unsubscribe when component unmounts
      return () => {
        observers.unSubscribe(channel, callback, false);
      };
    },
    () => ({
      isDirty: input?.isDirty ?? false,
      isPristine: input?.isPristine ?? true,
      isFocus: input?.isFocus ?? false,
    })
  );

  const isDirty = () => fieldStateSnapshot().isDirty;
  const isPristine = () => fieldStateSnapshot().isPristine;
  const isFocused = () => fieldStateSnapshot().isFocus;

  // ==================== SYNC FIELD PROPERTIES ====================
  const isRequired = useSync<boolean>(
    (notify) => {
      return createEffect(() => {
        input?.validationOptions?.required?.value;
        notify();
      });
    },
    () => input?.validationOptions?.required?.value ?? false
  );

  // Note: disabled is a plain property on input, not a signal
  // We can derive it from fieldStateSnapshot or check directly
  const isDisabled = () => {
    return input?.disabled ?? false;
  };

  // ==================== DERIVED VALIDATION FUNCTIONS ====================
  const hasErrors = () => {
    const results = validationResults();
    return results.some((r) => r.state === false && r.error);
  };

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

  const guides = (): IFieldGuide[] => {
    const results = validationResults();
    // ✅ Return ALL guides regardless of validation state
    // Guides are helpful hints that should show even when validation passes
    return results
      .filter((result: IValidationResult) => result.guide)
      .map(
        (result: IValidationResult) =>
          ({
            name: result.fieldName,
            code: result.code,
            message: result.guide!,
          }) as IFieldGuide
      );
  };

  // ==================== DERIVED STATE FUNCTIONS ====================
  // "Touched" means the field has been focused and then blurred at least once
  // We derive this from isDirty state (if dirty, user must have touched it)
  const isTouched = () => {
    // If field is dirty, it's been touched
    return isDirty();
  };

  // ==================== FIELD METADATA ====================
  const label = () => input?.label ?? field.name ?? '';
  const name = () => input?.name ?? field.name ?? '';
  const type = () => input?.type ?? 'text';

  // ==================== FIELD ACTIONS ====================
  const setValue = (newValue: any) => {
    input?._value?.set(newValue);
  };

  const focus = () => {
    field?.focus?.();
  };

  const blur = () => {
    field?.blur?.();
  };

  const reset = () => {
    field?.reset?.();
  };

  const touch = () => {
    // Mark field as touched by making it dirty if it isn't already
    // In formular, "touched" is implicit from user interaction
    // We can simulate it by ensuring the field has been interacted with
    if (!isDirty() && !isFocused()) {
      // Focus and blur to mark as touched
      focus();
      // Use setTimeout to allow focus to register before blur
      setTimeout(() => blur(), 0);
    }
  };

  return {
    // Value management
    value,
    setValue,

    // Validation state
    hasErrors,
    errors,
    guides,
    validationResults,

    // Field state
    isValid,
    isDirty,
    isPristine,
    isTouched,
    isFocused,

    // Field properties
    isDisabled,
    isRequired,
    label,
    name,
    type,

    // Field actions
    focus,
    blur,
    reset,
    touch,
  };
}
