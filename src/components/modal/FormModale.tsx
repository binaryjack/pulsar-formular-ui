/**
 * FormModale component
 * Confirmation dialog for form actions (quit, reset, etc.)
 */

import { createSignal } from '@pulsar-framework/pulsar.dev/reactivity';
import { Button } from '@pulsar-framework/ui';
import { ModaleCommands, ModaleStyle } from '../../types';
import { useModale } from './useModale';

/**
 * FormModale component
 * Displays confirmation dialogs for form operations
 */
export const FormModale = (): HTMLElement => {
  const { modalState, handleYes, handleNo } = useModale(
    ModaleCommands.YesCancel,
    ModaleStyle.Primary
  );

  const [isVisible, setIsVisible] = createSignal(modalState.isOpen);

  return (
    <div
      data-form-modale
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        isVisible() ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onclick={handleNo}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4">{modalState.message || 'Confirm Action'}</h3>

        <div className="flex justify-end gap-3 mt-6">
          <Button {...{ onclick: handleNo }}>Cancel</Button>
          <Button {...{ onclick: handleYes }}>Confirm</Button>
        </div>
      </div>
    </div>
  ) as HTMLElement;
};
