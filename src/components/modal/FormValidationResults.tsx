/**
 * FormValidationResults component
 * Displays form-level validation errors
 */

import { useFormContext } from '../form-context';

/**
 * FormValidationResults component
 * Shows all validation errors for the form
 *
 * @remarks
 * This is a basic implementation. Customize styling and layout as needed.
 */
export const FormValidationResults = (): HTMLElement => {
  const { getErrors } = useFormContext();
  const errors = getErrors();

  // Convert Record<string, IFieldError[]> to flat array
  const errorList = Object.entries(errors).flatMap(([fieldName, fieldErrors]) =>
    fieldErrors.map((error) => ({ fieldName, ...error }))
  );

  if (errorList.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.setAttribute('data-form-validation-results', 'true');
    emptyDiv.style.display = 'none';
    return emptyDiv;
  }

  return (
    <div
      data-form-validation-results
      className="form-validation-results bg-red-50 border border-red-200 rounded p-4 mb-4"
    >
      <h3 className="text-red-800 font-semibold mb-2">Validation Errors:</h3>
      <ul className="list-disc list-inside space-y-1">
        {errorList.map((error, index) => (
          <li key={index} className="text-red-700 text-sm">
            {error.fieldName}: {error.message || error.code}
          </li>
        ))}
      </ul>
    </div>
  );
};
