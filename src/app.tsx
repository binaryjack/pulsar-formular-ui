/**
 * Development entry point for testing pulsar-formular-ui components
 */

import { createForm, f } from 'formular.dev.lib';
import { bootstrapApp } from 'pulsar';
import { TextField } from './components';
import { FormProvider } from './components/form-provider';
import './styles.css';

/**
 * Define form schema using f.object()
 */
const userSchema = f.object({
  username: f.string().min(3).max(20).nonempty().debounce(2000),
  email: f.string().email().nonempty().debounce(7000),
  bio: f.string().min(10).max(200).optional(),
});

/**
 * Main application component - Demo form with real-time data display
 */

// Create form using new v2.0 API
const form = await createForm({
  schema: userSchema,
  defaultValues: {
    username: '',
    email: '',
    bio: '',
  },
  onSubmit: async (data) => {
    console.log('✅ [FORMULAR] Form submitted:', data);
  },
  onSuccess: (data) => {
    console.log('✅ [FORMULAR] Form saved successfully:', data);
  },
  onError: (error) => {
    console.error('❌ [FORMULAR] Form error:', error);
  },
});

const App = async () => {
  // Debug: Log form structure
  console.log('📋 [FORMULAR] Form created:', form);
  console.log('📋 [FORMULAR] Form fields:', form.fields);
  console.log('📋 [FORMULAR] Form fields is Array:', Array.isArray(form.fields));

  // Fields are in an array, access by index
  if (form.fields && form.fields.length > 0) {
    console.log('📋 [FORMULAR] Field[0] (username):', form.fields[0]);
    console.log('📋 [FORMULAR] Field[0] name:', form.fields[0]?.input?.name);
    console.log('📋 [FORMULAR] Field[0] isInitialized:', form.fields[0]?.isInitialized);

    if (form.fields[1]) {
      console.log('📋 [FORMULAR] Field[1] (email):', form.fields[1]);
      console.log('📋 [FORMULAR] Field[1] name:', form.fields[1]?.input?.name);
      console.log('📋 [FORMULAR] Field[1] isInitialized:', form.fields[1]?.isInitialized);
    }
  }

  // Demo form with live data display to visualize debouncing
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formular Debouncing Demo</h1>
          <p className="text-gray-600 mb-6">
            Type in the fields below and watch real-time debounced updates appear in the JSON
            display below.
          </p>

          <FormProvider
            form={form}
            onSaveCallback={() => console.log('Save clicked')}
            onQuitCallback={() => console.log('Quit clicked')}
          >
            <div className="space-y-6">
              <TextField name="username" />
              <TextField name="email" />
              <TextField name="bio" />
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

/**
 * Bootstrap the application using builder pattern
 */
const appRoot = bootstrapApp()
  .root('#app')
  .onMount((element) => {
    console.log('[Formular UI Demo] Mounted successfully', element);
  })
  .onError((error) => {
    console.error('[Formular UI Demo] Error:', error);
  })
  .build();

// Mount - bootstrapper handles DOM ready internally
// App is async now, so we need to wait for it
App().then((appElement) => {
  appRoot.mount(appElement);
});

form.subscribe('onValidate', 'debug').on((data) => {
  console.log('_:::::::::_', data);
});
