import {
  fieldOptions as defaultFieldOptions,
  IFieldSetProps,
} from '../../types/field-component.type';
import { useFormContext } from '../form-context';
import { ValidationResults } from '../modal/ValidationResults';
import { FSelectField } from '../primitives/FSelectField';

/**
 * SelectField - Integrated select dropdown component
 *
 * A FieldSet wrapper that combines:
 * - Label element
 * - FSelectField primitive
 * - ValidationResults
 * - Optional debug panel
 *
 * @param name - Field name (must match form field descriptor)
 * @param options - Optional field options (debug, loading)
 */
export function SelectField(props: IFieldSetProps) {
  const { name, options = defaultFieldOptions } = props;
  const formContext = useFormContext();
  const field = formContext.getField(name);

  if (!field) {
    return (
      <div id={`${name}-field-set`} className="text-red-600">
        Field "{name}" not found in form context
      </div>
    );
  }

  return (
    <div id={`${name}-field-set`} className="space-y-2">
      <label htmlFor={`${name}-select`} className="block text-sm font-medium">
        {field.label}
      </label>

      <FSelectField name={name} />

      <ValidationResults name={name} />

      {options.debug && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> name={name}, value={JSON.stringify(field.value)}
        </div>
      )}
    </div>
  );
}
