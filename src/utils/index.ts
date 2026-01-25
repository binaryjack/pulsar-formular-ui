/**
 * Utility functions for form components
 */

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(prefix: string = 'field'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// Export hooks and utilities
export * from './useFieldDescriptors';
export * from './useFormularManager';

