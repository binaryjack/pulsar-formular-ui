/**
 * Bridge between formular.dev signals and Pulsar's reactive system
 * Similar to React's useSyncExternalStore
 *
 * This hook allows Pulsar components to reactively subscribe to formular.dev signals
 * and trigger re-renders when the signal values change.
 */

import { createEffect, createSignal } from '@pulsar-framework/pulsar.dev';

/**
 * Subscribe a Pulsar signal to a formular.dev signal
 *
 * @param formularSignal - The formular.dev signal getter to subscribe to
 * @returns A Pulsar signal that updates when the formular signal changes
 *
 * @example
 * ```tsx
 * const [validationResults] = useFormularSignal(() => input._validationResults.get());
 * // Now validationResults() is a Pulsar signal that tracks formular.dev's state
 * ```
 */
export function useFormularSignal<T>(formularSignalGetter: () => T): [() => T, (value: T) => void] {
  // Create a Pulsar signal to mirror the formular signal
  const [pulsarValue, setPulsarValue] = createSignal<T>(formularSignalGetter());

  // Use formular.dev's createEffect to track the signal
  // When it changes, update the Pulsar signal
  createEffect(() => {
    const newValue = formularSignalGetter();
    setPulsarValue(newValue);
  });

  return [pulsarValue, setPulsarValue];
}
