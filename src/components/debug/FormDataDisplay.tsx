/**
 * FormDataDisplay - Real-time form data viewer
 *
 * Subscribes to NotificationManager observers to watch form changes.
 * Demonstrates debouncing by tracking when notifications fire.
 */

import { createSignal, useEffect } from 'pulsar/hooks';
import { useFormContext } from '../form-context';

interface FormDataUpdate {
  data: Record<string, any>;
  timestamp: string;
  updateCount: number;
}

export function FormDataDisplay() {
  const { form } = useFormContext();
  const [updates, setUpdates] = createSignal<FormDataUpdate[]>([]);
  const [updateCount, setUpdateCount] = createSignal(0);

  useEffect(() => {
    if (!form) {
      console.warn('[FormDataDisplay] Form not available');
      return;
    }

    try {
      console.log('[FormDataDisplay] Subscribing to form observers via form.observe()...');

      // Subscribe to each field's notifications via the new form.observe() API
      const unsubscribers: Array<() => void> = [];

      if (form.fields && Array.isArray(form.fields)) {
        form.fields.forEach((field: any, index: number) => {
          const fieldId = field?.input?.id;
          const fieldName = field?.input?.name || `field_${index}`;

          if (fieldId) {
            console.log(
              `[FormDataDisplay] Setting up observer for field: ${fieldName} (id: ${fieldId})`
            );

            // Create a callback that will be called when notifications fire
            const handleFieldChange = () => {
              console.log(`[FormDataDisplay] FIRED CALLBACK FOR FIELD: ${fieldName} (${fieldId})`);

              const now = new Date();
              const timestamp = now.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3,
              });

              const newCount = updateCount() + 1;
              setUpdateCount(newCount);

              try {
                const formData = form.getData();
                const update: FormDataUpdate = {
                  data: formData,
                  timestamp,
                  updateCount: newCount,
                };

                setUpdates((prev) => {
                  const newUpdates = [update, ...prev];
                  return newUpdates.slice(0, 10);
                });

                console.log(
                  `🔄 [FormDataDisplay] Update #${newCount} at ${timestamp} (${fieldName}):`,
                  formData
                );
              } catch (err) {
                console.error('[FormDataDisplay] Error getting form data:', err);
              }
            };

            // Subscribe to the field via the new form.observe() API
            const unsub = (form as any).observe(String(fieldId), handleFieldChange);
            console.log(`✅ [FormDataDisplay] Subscribed to field: ${fieldName}`);
            unsubscribers.push(unsub);
          }
        });
      }

      console.log(`✅ [FormDataDisplay] Subscribed to ${unsubscribers.length} field observers`);

      // Return cleanup function
      return () => {
        unsubscribers.forEach((unsub) => {
          try {
            unsub();
          } catch (err) {
            console.warn('[FormDataDisplay] Error unsubscribing:', err);
          }
        });
        console.log(
          `🧹 [FormDataDisplay] Unsubscribed from ${unsubscribers.length} field observers`
        );
      };
    } catch (err) {
      console.error('[FormDataDisplay] Error setting up observers:', err);
    }
  }, [form]); // Only run once when form changes

  return (
    <div className="mt-8 p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Form Data (Debounced Updates)</h3>
        <div className="text-sm text-gray-400">
          Total Updates: <span className="text-blue-400 font-mono">{updateCount()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {updates().length === 0 ? (
          <div className="text-gray-500 text-sm italic p-4 bg-gray-800 rounded">
            No updates yet. Start typing in the form fields above...
          </div>
        ) : (
          updates().map((update, index) => (
            <div
              key={`${update.timestamp}-${index}`}
              className={`p-4 rounded ${
                index === 0 ? 'bg-blue-900 border-2 border-blue-500' : 'bg-gray-800'
              } transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-400">
                  Update #{update.updateCount}
                </span>
                <span className="text-xs font-mono text-blue-400">{update.timestamp}</span>
              </div>
              <pre className="text-sm text-green-400 overflow-x-auto">
                {JSON.stringify(update.data, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <strong className="text-white">Tip:</strong> Type quickly in the fields above and watch
          how the updates are <span className="text-blue-400">debounced</span>. The timestamp shows
          when each debounced update fires, not every keystroke.
        </p>
      </div>
    </div>
  );
}
