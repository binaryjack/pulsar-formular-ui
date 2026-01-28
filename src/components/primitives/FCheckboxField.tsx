/**
 * FCheckboxField primitive component
 * Atomic checkbox field with formular.dev binding
 *
 * @example
 * ```tsx
 * <FCheckboxField name="agreeToTerms" />
 * ```
 */

import type { IFieldComponentProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FCheckboxField component - Primitive checkbox field
 * Single output: <input type="checkbox"> element
 */
export const FCheckboxField = ({
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
    return <div className="h-5 w-5 bg-gray-200 animate-pulse rounded" data-loading={name} />;
  }

  // Single output: checkbox input
  return (
    <input
      type="checkbox"
      {...field.register()}
      ref={field.ref}
      className={`h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${className}`}
      checked={field.value}
    />
  );
};
