# Quick Start Guide - Pulsar Formular UI

This guide will help you create your first form with `@pulsar-framework/formular-ui` in 5 minutes.

## Prerequisites

Make sure you have a Pulsar application set up. If not, see the [Pulsar Getting Started Guide](../pulsar.dev/docs/getting-started.md).

## Step 1: Install Dependencies

```bash
pnpm add @pulsar-framework/formular-ui formular.dev
```

## Step 2: Create Your First Form

Create a new file `ContactForm.tsx`:

```tsx
import { bootstrapApp, AppContextProvider } from 'pulsar';
import {
  FormProvider,
  TextField,
  TextareaInput,
  Checkbox,
  useFieldDescriptors,
} from '@pulsar-framework/formular-ui';
import { createMockFormular } from '@pulsar-framework/formular-ui/helpers';

// 1. Define your form data interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  subscribe: boolean;
}

// 2. Create the form component
export const ContactForm = () => {
  // Define field configuration
  const fields = useFieldDescriptors<ContactFormData>({
    name: {
      type: 'text',
      label: 'Your Name',
      placeholder: 'John Doe',
    },
    email: {
      type: 'email',
      label: 'Email Address',
      placeholder: 'john@example.com',
    },
    subject: {
      type: 'text',
      label: 'Subject',
      placeholder: 'How can we help?',
    },
    message: {
      type: 'textarea',
      label: 'Message',
      placeholder: 'Tell us more...',
    },
    subscribe: {
      type: 'checkbox',
      label: 'Subscribe to newsletter',
    },
  });

  // Create form instance
  const form = createMockFormular('contactForm', fields);

  // Handle form submission
  const handleSubmit = () => {
    const data = form.getData();
    console.log('Form submitted:', data);

    // TODO: Send to your API
    // await fetch('/api/contact', {
    //   method: 'POST',
    //   body: JSON.stringify(data)
    // });

    alert('Message sent!');
    form.reset();
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel?')) {
      form.reset();
    }
  };

  // Render the form
  return (
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>

          <FormProvider form={form} onSaveCallback={handleSubmit} onQuitCallback={handleCancel}>
            <div class="space-y-6">
              <TextField name="name" showLabel={true} showErrors={true} />

              <TextField name="email" showLabel={true} showErrors={true} />

              <TextField name="subject" showLabel={true} showErrors={true} />

              <TextareaInput name="message" showLabel={true} showErrors={true} rows={6} />

              <Checkbox name="subscribe" />
            </div>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
```

## Step 3: Bootstrap Your Application

Create your `main.tsx`:

```tsx
import { bootstrapApp, AppContextProvider } from 'pulsar';
import { ContactForm } from './ContactForm';

// Create application root
const appRoot = bootstrapApp()
  .root('#app')
  .onMount((element) => {
    console.log('App mounted', element);
  })
  .onError((error) => {
    console.error('App error:', error);
  })
  .build();

// Wrap app with context
const app = (
  <AppContextProvider
    root={appRoot}
    context={{
      appName: 'Contact Form App',
      version: '1.0.0',
    }}
  >
    <ContactForm />
  </AppContextProvider>
);

// Mount to DOM
document.getElementById('app')?.appendChild(app);
```

## Step 4: Add HTML Entry Point

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Form</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Step 5: Configure Vite

Create or update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { pulsarPlugin } from '@pulsar-framework/vite-plugin';

export default defineConfig({
  plugins: [pulsarPlugin()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'pulsar',
  },
});
```

## Step 6: Run Your App

```bash
pnpm dev
```

Open your browser to `http://localhost:5173` and you should see your contact form!

## What's Next?

### Add Validation

Use built-in validation presets:

```tsx
import { ValidationPresets } from 'formular.dev';

const fields = useFieldDescriptors<ContactFormData>({
  email: {
    type: 'email',
    label: 'Email',
    validation: ValidationPresets.email(true), // ✅ true = required + email validation
  },
  name: {
    type: 'text',
    label: 'Name',
    validation: ValidationPresets.minLength(3), // ✅ Min 3 characters
  },
});
```

### Handle Form State

Access form state anywhere in your component tree:

```tsx
import { useFormContext } from '@pulsar-framework/formular-ui';

const FormStatus = () => {
  const { form } = useFormContext();

  return <div>Current email: {form.getFieldValue('email')}</div>;
};
```

### Use Portal System

Place save/cancel buttons anywhere:

```tsx
import { Portal, PortalSlot } from '@pulsar-framework/formular-ui';

const App = () => (
  <div>
    <header>
      {/* Buttons will appear here */}
      <PortalSlot id="contactForm" name="commands" />
    </header>

    <FormProvider form={form}>
      <TextField name="name" />

      {/* Buttons defined here, render in header */}
      <Portal id={form.id} target="commands">
        <button onClick={handleSave}>Save</button>
      </Portal>
    </FormProvider>
  </div>
);
```

### Explore All Components

Available components:

- `TextField` - Text, email, password, number
- `TextareaInput` - Multi-line text
- `Checkbox` - Single checkbox
- `Toggle` - Toggle switch
- `SelectInput` - Dropdown
- `RadioGroup` - Radio buttons

See [README.md](./README.md) for complete API documentation.

## Common Issues

### Blank Screen

Make sure you have:

1. ✅ `pulsarPlugin()` in vite.config.ts
2. ✅ `jsx: 'automatic'` and `jsxImportSource: 'pulsar'` in esbuild config
3. ✅ Tailwind CSS loaded (CDN or installed)

### Context Errors

If you see "useFormContext must be used within FormProvider":

- ✅ Ensure `@pulsar-framework/vite-plugin` is installed
- ✅ Wrap your fields in `<FormProvider>`
- ✅ Check that pulsarPlugin() is in plugins array

### TypeScript Errors

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "jsx",
    "jsxFragmentFactory": "Fragment"
  }
}
```

## Examples

See [src/demo.tsx](./src/demo.tsx) for a complete working example with:

- Multiple field types
- Validation
- Error handling
- Portal integration
- Custom styling

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🎨 [Storybook Examples](http://localhost:6007) (run `pnpm storybook`)
- 🐛 [Report Issues](https://github.com/binaryjack/pulsar-formular-ui/issues)
- 💬 [Ask Questions](https://github.com/binaryjack/pulsar-formular-ui/discussions)

Happy coding! 🚀
