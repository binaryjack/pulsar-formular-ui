/**
 * Development entry point for testing pulsar-formular-ui components
 */

import { createForm, f } from 'formular.dev.lib';
import { bootstrapApp } from 'pulsar';
import { FormProvider } from './components/form-provider';
import { TextField } from './components/integrated';
import './styles.css';

/**
 * Define form schema using f.object()
 */
const userSchema = f.object({
  username: f.string().min(3).max(20).nonempty(),
  email: f.string().email().nonempty(),
});

/**
 * Main application component - Manual test of deferred children pattern
 */
const App = () => {
  console.log('[App] Rendering');

  // Create form using new v2.0 API
  const form = createForm({
    schema: userSchema,
    defaultValues: {
      username: '',
      email: '',
    },
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
    },
    onSuccess: (data) => {
      console.log('Form saved successfully:', data);
    },
    onError: (error) => {
      console.error('Form error:', error);
    },
  });

  // TEST: Manual deferred children pattern (simulating transformer output)
  // Calling FormProvider imperatively with arrow function for children
  return FormProvider({
    form: form,
    onSaveCallback: () => console.log('Form save callback'),
    onQuitCallback: () => console.log('Form quit callback'),
    children: () => [
      // Arrow function defers execution until Provider has set context
      TextField({ name: 'username' }),
      TextField({ name: 'email' }),
    ],
  });
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

// Mount app directly for deferred children test (no AppContextProvider wrapper)
appRoot.mount(App());
