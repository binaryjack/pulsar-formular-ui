/**
 * FInputField primitive component
 * Atomic input field with formular.dev binding
 *
 * @example
 * ```tsx
 * <FInputField name="username" />
 * <FInputField name="email" loading={true} />
 * ```
 */

import type { IFieldComponentProps } from '../../types';
import { devLog } from '../../utils/dev-logger';
import { useFormContext } from '../form-context';

/**
 * FInputField component - Primitive input field
 * Single output: <input> element with formular binding
 */
export const FInputField = ({
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

  // Skeleton fallback on loading
  if (loading) {
    return <div className="h-10 w-full bg-gray-200 animate-pulse rounded" data-loading={name} />;
  }

  // Get registration attributes from formular.dev
  const registerAttrs = field.register();

  // Bind ref function to attach event listeners manually
  const boundRef = (element: HTMLInputElement | null) => {
    if (element) {
      // Attach event handlers manually (Pulsar doesn't auto-convert JSX events to addEventListener)
      if (registerAttrs.onChange) {
        element.addEventListener('input', registerAttrs.onChange as EventListener);
      }
      if (registerAttrs.onBlur) {
        element.addEventListener('blur', registerAttrs.onBlur as EventListener);
      }
      if (registerAttrs.onFocus) {
        element.addEventListener('focus', registerAttrs.onFocus as EventListener);
      }
    }

    field.ref(element);
  };

  // Extract non-event attributes for spreading
  const { onChange, onBlur, onFocus, ...attrs } = registerAttrs;

  return (
    <input
      {...attrs}
      ref={boundRef}
      className={`px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none w-full ${className}`}
    />
  );
};
