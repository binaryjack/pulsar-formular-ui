/**
 * FRadioButton primitive component
 * Atomic radio button with formular.dev binding
 *
 * @example
 * ```tsx
 * <FRadioButton name="gender" value="male" />
 * <FRadioButton name="gender" value="female" />
 * ```
 */

import type { IRadioButtonProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FRadioButton component - Primitive radio button
 * Single output: <input type="radio"> element ONLY (no label)
 */
export const FRadioButton = ({
  name,
  value,
  loading = false,
  className = '',
}: IRadioButtonProps): HTMLElement => {
  const { getField } = useFormContext();
  const field = getField(name);

  if (!field) {
    devLog.warn(`Field "${name}" not found in form`);
    return <div data-field-error>{`Field "${name}" not found`}</div>;
  }

  // Skeleton fallback
  if (loading) {
    return (
      <div
        className="h-5 w-5 bg-gray-200 animate-pulse rounded-full"
        data-loading={`${name}-${value}`}
      />
    );
  }

  // Single output: radio input (NO label wrapper)
  const isChecked = field.value === value;

  return (
    <input
      type="radio"
      {...field.register()}
      ref={field.ref}
      name={field.name}
      value={value}
      checked={isChecked}
      className={`h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500 ${className}`}
    />
  );
};
