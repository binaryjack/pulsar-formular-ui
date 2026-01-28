/**
 * FTextareaField primitive component
 * Atomic textarea field with formular.dev binding
 *
 * @example
 * ```tsx
 * <FTextareaField name="description" />
 * ```
 */

import type { IFieldComponentProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FTextareaField component - Primitive textarea field
 * Single output: <textarea> element
 */
export const FTextareaField = ({
  name,
  loading = false,
  className = '',
}: IFieldComponentProps): HTMLElement => {
  const { getField } = useFormContext();
  const field = getField(name);

  if (!field) {
    devLog.warn(`Field "${name}" not found in form`);
    return <div data-field-error>{`Field "${name}" not found`}</div>;
  }

  // Skeleton fallback
  if (loading) {
    return <div className="h-24 w-full bg-gray-200 animate-pulse rounded" data-loading={name} />;
  }

  // Single output: textarea element
  return (
    <textarea
      {...field.register()}
      ref={field.ref}
      className={`px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-full ${className}`}
      rows={4}
    />
  );
};
