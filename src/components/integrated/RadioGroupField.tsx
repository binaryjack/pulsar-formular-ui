import type { IOptionItem } from '@pulsar-framework/formular.dev';
import {
  fieldOptions as defaultFieldOptions,
  IFieldSetProps,
} from '../../types/field-component.type';
import { useFormContext } from '../form-context';
import { ValidationResults } from '../modal/ValidationResults';
import { FRadioButton } from '../primitives/FRadioButton';

/**
 * RadioGroupField - Integrated radio button group component
 *
 * A FieldSet wrapper that combines:
 * - Group label
 * - Multiple FRadioButton primitives with labels
 * - ValidationResults
 * - Optional debug panel
 *
 * Note: Radio options must be defined in field descriptor's options array
 *
 * @param name - Field name (must match form field descriptor)
 * @param options - Optional field options (debug, loading)
 */
export function RadioGroupField(props: IFieldSetProps) {
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

  if (!field.options || field.options.length === 0) {
    return (
      <div id={`${name}-field-set`} className="text-red-600">
        Field "{name}" requires options array for radio group
      </div>
    );
  }

  return (
    <div id={`${name}-field-set`} className="space-y-2">
      <fieldset>
        <legend className="block text-sm font-medium mb-2">{field.label}</legend>
        <div className="space-y-2">
          {field.options.map((option: IOptionItem) => (
            <label key={String(option.value)} className="flex items-center cursor-pointer">
              <FRadioButton name={name} value={option.value} />
              <span className="ml-2 text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <ValidationResults name={name} />

      {options.debug && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          <strong>Debug:</strong> name={name}, value={JSON.stringify(field.value)}
        </div>
      )}
    </div>
  );
}
