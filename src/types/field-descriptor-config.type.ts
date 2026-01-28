/**
 * Field descriptor configuration types
 * Used for declarative field definition with useFieldDescriptors hook
 */

import type { IFieldDescriptor, ValidationConstraintConfig } from '@pulsar-framework/formular.dev';

/**
 * Field configuration for a single field
 * Simplified API for creating field descriptors
 */
export interface IFieldConfig {
  /** Field type (text, email, password, number, checkbox, select, radio, etc.) */
  readonly type?: string;

  /** Display label for the field */
  readonly label?: string;

  /** Default value for the field */
  readonly defaultValue?: string | number | boolean | null;

  /** Validation constraints for this field */
  readonly validation?: ValidationConstraintConfig[];

  /** Minimum value (for numbers) or length (for text) */
  readonly min?: number;

  /** Maximum value (for numbers) or length (for text) */
  readonly max?: number;

  /** Minimum length (for text fields) */
  readonly minLength?: number;

  /** Maximum length (for text fields) */
  readonly maxLength?: number;

  /** Pattern for validation (regex) */
  readonly pattern?: string;

  /** Options for select/radio/checkbox fields */
  readonly options?: Array<{ label: string; value: any }>;

  /** Placeholder text */
  readonly placeholder?: string;

  /** Whether field is disabled */
  readonly disabled?: boolean;

  /** Whether field is read-only */
  readonly readOnly?: boolean;

  /** Input mask pattern */
  readonly mask?: string;

  /** Any additional properties to pass to the field descriptor */
  [key: string]: any;
}

/**
 * Configuration object for multiple fields
 * Maps field names to their configurations
 *
 * @example
 * ```typescript
 * const config: FieldDescriptorConfig<User> = {
 *   username: { type: 'text', required: true },
 *   email: { type: 'email', required: true },
 *   age: { type: 'number', min: 18 }
 * }
 * ```
 */
export type FieldDescriptorConfig<T extends Record<string, any>> = {
  [K in keyof T]?: IFieldConfig;
};

/**
 * Result type from useFieldDescriptors hook
 */
export type FieldDescriptorResult = IFieldDescriptor[];
