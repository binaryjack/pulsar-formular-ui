/**
 * FToggleField primitive component
 * Atomic toggle/switch field with formular.dev binding
 *
 * @example
 * ```tsx
 * <FToggleField name="notifications" />
 * ```
 */

import type { IFieldComponentProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FToggleField component - Primitive toggle field
 * Single output: <input type="checkbox"> styled as toggle
 */
export const FToggleField = ({
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
    return <div className="h-6 w-11 bg-gray-200 animate-pulse rounded-full" data-loading={name} />;
  }

  // Single output: checkbox input (styled as toggle)
  return (
    <input
      type="checkbox"
      {...field.register()}
      ref={field.ref}
      className={`h-6 w-11 appearance-none bg-gray-200 rounded-full relative cursor-pointer transition-colors checked:bg-blue-600 before:content-[''] before:absolute before:h-5 before:w-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5 ${className}`}
      checked={field.value}
    />
  );
};
