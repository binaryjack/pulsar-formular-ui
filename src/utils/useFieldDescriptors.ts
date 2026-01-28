/**
 * useFieldDescriptors hook
 * Converts declarative field configuration to IFieldDescriptor[]
 *
 * @example
 * ```typescript
 * const userFields = useFieldDescriptors<User>({
 *   username: {
 *     type: 'text',
 *     validation: ValidationPresets.username(true)
 *   },
 *   email: {
 *     type: 'email',
 *     validation: ValidationPresets.email(true)
 *   }
 * })
 * ```
 */

import type { IFieldDescriptor } from '@pulsar-framework/formular.dev';
import type { FieldDescriptorConfig } from '../types';

/**
 * Hook for creating field descriptors from configuration
 *
 * @template T - The shape of the form data
 * @param config - Field configuration object
 * @returns Array of field descriptors
 */
export function useFieldDescriptors<T extends Record<string, any>>(
  config: FieldDescriptorConfig<T>
): IFieldDescriptor[] {
  return Object.entries(config).map(([key, fieldConfig], index) => {
    const descriptor: IFieldDescriptor = {
      id: index,
      name: key,
      type: (fieldConfig?.type || 'text') as any,
      label: fieldConfig?.label || key,
      value: null,
      objectValue: null,
      defaultValue: fieldConfig?.defaultValue ?? null,
      errors: [],
      guides: [],
      validationOptions: {
        min: fieldConfig?.min ? { value: fieldConfig.min } : undefined,
        max: fieldConfig?.max ? { value: fieldConfig.max } : undefined,
        minLength: fieldConfig?.minLength ? { value: fieldConfig.minLength } : undefined,
        maxLength: fieldConfig?.maxLength ? { value: fieldConfig.maxLength } : undefined,
        pattern: fieldConfig?.pattern ? { value: new RegExp(fieldConfig.pattern) } : undefined,
      },
      options:
        fieldConfig?.options?.map((opt, idx) => ({
          id: idx,
          value: opt.value,
          label: opt.label,
          selected: false,
        })) || [],
      isValid: true, // Start valid, validation constraints will determine actual state
      isDirty: false,
      isPristine: true,
      isFocus: false,
      shouldValidate: true,
      loaded: false,
      changed: false,
      mask: fieldConfig?.mask,
      disabled: fieldConfig?.disabled,
      readOnly: fieldConfig?.readOnly,
      placeholder: fieldConfig?.placeholder,
      // Spread any additional properties from config
      ...fieldConfig,
    };

    return descriptor;
  });
}
