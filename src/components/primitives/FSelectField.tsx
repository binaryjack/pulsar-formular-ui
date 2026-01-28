/**
 * FSelectField primitive component
 * Atomic select field with formular.dev binding
 *
 * @example
 * ```tsx
 * <FSelectField name="country" />
 * ```
 */

import type { ISelectFieldProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FSelectField component - Primitive select field
 * Single output: <select> element
 */
export const FSelectField = ({
  name,
  loading = false,
  placeholder,
  className = '',
}: ISelectFieldProps): HTMLElement => {
  const { getField } = useFormContext();
  const field = getField(name);

  if (!field) {
    devLog.warn(`Field "${name}" not found in form`);
    return <div data-field-error>{`Field "${name}" not found`}</div>;
  }

  // Skeleton fallback
  if (loading) {
    return <div className="h-10 w-full bg-gray-200 animate-pulse rounded" data-loading={name} />;
  }

  // Single output: select element
  return (
    <select
      {...field.register()}
      ref={field.ref}
      className={`px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-full ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {field.options?.map((option: any) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
