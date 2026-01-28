/**
 * FormProvider component
 * Main form wrapper that provides context, lifecycle management, and validation orchestration
 *
 * @example
 * ```tsx
 * const form = useMemo(
 *   () => formManager.createFromDescriptors<User>('userForm', userFields),
 *   [formManager, userFields]
 * )
 *
 * <FormProvider
 *   form={form}
 *   data={userData}
 *   onSaveCallback={handleSave}
 *   onQuitCallback={handleQuit}
 * >
 *   <InputField name="username" />
 *   <InputField name="email" />
 * </FormProvider>
 * ```
 */

import { useEffect } from '@pulsar-framework/pulsar.dev/hooks';
import { Button } from '@pulsar-framework/ui';
import type { IFormContext, IFormProviderProps } from '../../types';
import { ModaleCommands, ModaleStyle } from '../../types';
import { FormContext } from '../form-context';
import { FormModale, FormValidationResults, useModale } from '../modal';
// import { Portal } from '../portal' // TODO: Portal component not yet implemented

/**
 * FormProvider component
 * Provides form context and manages form lifecycle
 */
export const FormProvider = <T extends object>({
  form,
  data,
  onSaveCallback,
  onQuitCallback,
  children,
}: IFormProviderProps<T>): HTMLElement => {
  const { openModale, onModaleResult } = useModale(ModaleCommands.YesCancel, ModaleStyle.Primary);

  if (!form) {
    return <div>FormProvider requires an instance of a form !</div>;
  }

  // Parse data on mount, clear on unmount
  useEffect(() => {
    if (data) {
      form?.parse(data);
    }

    return () => {
      form?.clear();
    };
  }, [data, form]);

  // Handle modal result (quit confirmation)
  useEffect(() => {
    if (onModaleResult.Yes) {
      onQuitCallback();
    }
  }, [onModaleResult, onQuitCallback]);

  /**
   * Save form data (after validation)
   */
  const handleSaveData = () => {
    if (!form?.validateForm()) {
      return;
    }
    onSaveCallback();
  };

  /**
   * Quit form (with confirmation if dirty)
   */
  const handleQuit = () => {
    if (form?.isDirty) {
      openModale('form.quit.confirm');
      return;
    }
    onQuitCallback();
  };

  /**
   * Update field value (with pre-validation)
   */
  const handleFieldUpdate = (fieldName: string, value: unknown) => {
    if (!form?.preValidateField(fieldName)) {
      return;
    }
    form?.updateField(fieldName, value as string | number | boolean | null);
  };

  /**
   * Clear field value
   */
  const handleClearField = (fieldName: string) => {
    form?.clearField(fieldName);
  };

  /**
   * Reset form to defaults
   */
  const handleResetForm = () => {
    form?.reset();
  };

  /**
   * Get field instance by name
   * Returns the actual field with register() and ref methods
   */
  const getField = (fieldName: string) => {
    const fieldWrapper = form?.getField(fieldName);
    // Return the wrapper itself - it should have register() and ref() methods
    return fieldWrapper;
  };

  /**
   * Pre-validate field (before blur/change)
   */
  const preValidateField = (fieldName: string) => {
    return form?.preValidateField(fieldName);
  };

  /**
   * Validate single field
   */
  const validateField = (fieldName: string) => {
    form?.validateField(fieldName);
  };

  /**
   * Validate entire form
   */
  const validateForm = () => {
    return form?.validateForm();
  };

  /**
   * Get all form errors
   */
  const getErrors = () => {
    return form?.getErrors();
  };

  // Form context value
  const formContextData: IFormContext<T> = {
    form,
    updateField: handleFieldUpdate,
    clearField: handleClearField,
    reset: handleResetForm,
    getField,
    validateField,
    preValidateField,
    validateForm,
    getErrors,
  };

  // Context.Provider will set the signal BEFORE evaluating children
  // Don't pre-evaluate children here - let Provider handle the timing
  return (
    <FormContext.Provider value={formContextData}>
      <div data-form-provider={form?.id}>
        <form id={form?.id} className="space-y-6">
          {children}
        </form>
        <FormModale />
        <FormValidationResults />
        <div data-form-commands className="flex gap-2 mt-4">
          <Button {...{ onclick: handleSaveData }}>Save</Button>
          <Button {...{ onclick: handleResetForm }}>Reset</Button>
          <Button {...{ onclick: handleQuit }}>Quit</Button>
        </div>
      </div>
    </FormContext.Provider>
  );
};
