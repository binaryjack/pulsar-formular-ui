/**
 * useFormularManager hook
 * Provides access to the FormularManager instance
 * Can be injected via props or retrieved from service container
 */

import type { IFormularManager } from '@pulsar-framework/formular.dev';

/**
 * Hook for accessing the FormularManager singleton
 *
 * @param manager - Optional manager instance (for dependency injection)
 * @returns The FormularManager instance
 *
 * @example
 * ```typescript
 * const formManager = useFormularManager()
 * const form = useMemo(
 *   () => formManager.createFromDescriptors('userForm', userFields),
 *   [formManager, userFields]
 * )
 * ```
 */
export function useFormularManager(manager?: IFormularManager): IFormularManager {
  if (manager) {
    return manager;
  }

  // TODO: Retrieve from service container when available
  // For now, assume FormularManager is a singleton
  // return ServiceManager.get(SFormularManager)

  throw new Error(
    'FormularManager must be provided via props or service container. ' +
      'Pass manager prop to useFormularManager() or configure service container.'
  );
}
