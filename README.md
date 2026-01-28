# @pulsar-framework/formular-ui

**Enterprise-grade form components for Pulsar framework integrated with formular.dev**

[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue)](https://github.com/binaryjack/pulsar-formular-ui)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

A comprehensive, type-safe form component library that seamlessly combines [Pulsar framework](../pulsar.dev)'s reactive architecture with [formular.dev](../formular.dev) form management capabilities.

## ✨ Features

- 🎯 **Type-Safe** - Full TypeScript support with generics
- ⚡ **Reactive** - Built on Pulsar's fine-grained reactivity
- 📋 **Declarative** - Define forms with simple configuration objects
- ✅ **Validation** - Integrated with formular.dev validation presets
- 🎨 **Styled** - Pre-styled with Tailwind CSS
- 🔌 **Context-Based** - Access form state anywhere in your component tree
- 🚪 **Portal System** - Flexible command button placement
- ♿ **Accessible** - WCAG 2.1 compliant components
- 📖 **Documented** - Comprehensive Storybook stories

## 📦 Installation

```bash
# Using pnpm (recommended)
pnpm add @pulsar-framework/formular-ui

# Using npm
npm install @pulsar-framework/formular-ui

# Using yarn
yarn add @pulsar-framework/formular-ui
```

## 🚀 Quick Start

### 1. Basic Form Example

```tsx
import { bootstrapApp, AppContextProvider } from 'pulsar';
import {
  FormProvider,
  TextField,
  Checkbox,
  useFieldDescriptors,
} from '@pulsar-framework/formular-ui';
import { createMockFormular } from '@pulsar-framework/formular-ui/helpers';

// Define your data interface
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Create your form component
const LoginForm = () => {
  // 1. Define field descriptors
  const fields = useFieldDescriptors<LoginData>({
    email: {
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
    },
    password: {
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
    },
    rememberMe: {
      type: 'checkbox',
      label: 'Remember me',
    },
  });

  // 2. Create form instance
  const form = createMockFormular('loginForm', fields);

  // 3. Define handlers
  const handleSave = () => {
    const data = form.getData();
    console.log('Login data:', data);
    // Send to API...
  };

  const handleQuit = () => {
    form.reset();
  };

  // 4. Render with FormProvider
  return (
    <FormProvider form={form} onSaveCallback={handleSave} onQuitCallback={handleQuit}>
      <div class="space-y-4">
        <TextField name="email" showLabel={true} showErrors={true} />
        <TextField name="password" showLabel={true} showErrors={true} />
        <Checkbox name="rememberMe" />
      </div>
    </FormProvider>
  );
};

// Bootstrap your app
const appRoot = bootstrapApp()
  .root('#app')
  .onMount((el) => console.log('Mounted', el))
  .build();

const app = (
  <AppContextProvider root={appRoot} context={{ appName: 'My App' }}>
    <LoginForm />
  </AppContextProvider>
);

document.getElementById('app')?.appendChild(app);
```

### 2. Form with Validation

```tsx
import { ValidationPresets } from 'formular.dev';
import { useFieldDescriptors } from '@pulsar-framework/formular-ui';

interface UserData {
  username: string;
  email: string;
  age: number;
}

const fields = useFieldDescriptors<UserData>({
  username: {
    type: 'text',
    label: 'Username',
    validation: ValidationPresets.username(true), // true = required
    placeholder: 'Enter username',
  },
  email: {
    type: 'email',
    label: 'Email',
    validation: ValidationPresets.email(true), // true = required
    placeholder: 'you@example.com',
  },
  age: {
    type: 'number',
    label: 'Age',
    validation: ValidationPresets.minValue(18), // Minimum age validation
  },
});
```

### 3. All Available Components

```tsx
import {
  // Form Management
  FormProvider,
  useFormContext,
  useFieldDescriptors,

  // Input Components
  TextField, // Text, email, password, number inputs
  TextareaInput, // Multi-line text
  Checkbox, // Single checkbox
  Toggle, // Toggle switch
  SelectInput, // Dropdown select
  RadioGroup, // Radio button group

  // Portal System
  Portal,
  PortalSlot,

  // Utilities
  createMockFormular,
} from '@pulsar-framework/formular-ui';
```

## 📚 Component API

### FormProvider

Wraps your form and provides context to all child components.

**Props:**

- `form: IFormularBuilder` - Formular instance (required)
- `data?: T` - Initial form data
- `onSaveCallback?: () => void` - Called when save button clicked
- `onQuitCallback?: () => void` - Called when quit button clicked
- `children: HTMLElement | (() => HTMLElement)` - Form fields

**Example:**

```tsx
<FormProvider form={form} onSaveCallback={handleSave}>
  {/* Your form fields */}
</FormProvider>
```

### TextField

Text input with label, validation, and error display.

**Props:**

- `name: string` - Field name (required)
- `showLabel?: boolean` - Show field label (default: false)
- `showErrors?: boolean` - Show validation errors (default: false)
- `showGuides?: boolean` - Show helper text (default: false)
- `placeholder?: string` - Input placeholder

**Example:**

```tsx
<TextField
  name="email"
  showLabel={true}
  showErrors={true}
  showGuides={true}
  placeholder="Enter your email"
/>
```

### Checkbox

Checkbox with label and error display.

**Props:**

- `name: string` - Field name (required)

**Example:**

```tsx
<Checkbox name="agreeToTerms" />
```

### SelectInput

Dropdown select with label and validation.

**Props:**

- `name: string` - Field name (required)
- `showLabel?: boolean` - Show field label (default: false)
- `showErrors?: boolean` - Show validation errors (default: false)
- `showGuides?: boolean` - Show helper text (default: false)

**Example:**

```tsx
<SelectInput name="country" showLabel={true} showErrors={true} />
```

### RadioGroup

Radio button group with auto-rendered options.

**Props:**

- `name: string` - Field name (required)
- `showLabel?: boolean` - Show field label (default: false)
- `showErrors?: boolean` - Show validation errors (default: false)

**Example:**

```tsx
<RadioGroup name="gender" showLabel={true} />
```

### TextareaInput

Multi-line text input with label and validation.

**Props:**

- `name: string` - Field name (required)
- `showLabel?: boolean` - Show field label (default: false)
- `showErrors?: boolean` - Show validation errors (default: false)
- `showGuides?: boolean` - Show helper text (default: false)
- `rows?: number` - Number of visible rows (default: 4)

**Example:**

```tsx
<TextareaInput name="bio" showLabel={true} rows={6} />
```

### Toggle

Toggle switch with label.

**Props:**

- `name: string` - Field name (required)

**Example:**

```tsx
<Toggle name="notifications" />
```

## 🔧 Advanced Usage

### Accessing Form Context

Use `useFormContext()` to access form state anywhere in your component tree:

```tsx
import { useFormContext } from '@pulsar-framework/formular-ui';

const CustomComponent = () => {
  const { form, updateField, validateField } = useFormContext();

  const handleCustomAction = () => {
    const currentValue = form.getFieldValue('email');
    updateField('email', 'new@email.com');
    validateField('email');
  };

  return <button onClick={handleCustomAction}>Update Email</button>;
};
```

### Portal System for Flexible Layouts

Place form command buttons anywhere in your UI:

```tsx
import { Portal, PortalSlot } from '@pulsar-framework/formular-ui';

const MyApp = () => {
  return (
    <div>
      <header>
        {/* Portal target in header */}
        <PortalSlot id="myForm" name="commands" />
      </header>

      <FormProvider form={form}>
        <TextField name="title" />

        {/* Buttons render in header, not here! */}
        <Portal id={form.id} target="commands">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </Portal>
      </FormProvider>
    </div>
  );
};
```

### Custom Validation

```tsx
import { IFieldDescriptor } from 'formular.dev';

const customEmailValidator = (value: string): string | null => {
  if (!value.endsWith('@company.com')) {
    return 'Must be a company email address';
  }
  return null;
};

const fields = useFieldDescriptors<UserData>({
  email: {
    type: 'email',
    validation: customEmailValidator,
  },
});
```

## 🎨 Styling

Components use Tailwind CSS. You can:

1. **Use default styles** - Components work out-of-the-box with Tailwind
2. **Customize via Tailwind config** - Override colors, spacing, etc.
3. **Add custom classes** - Pass className props to components

```tsx
// Add Tailwind CDN to your HTML
<script src="https://cdn.tailwindcss.com"></script>

// Or install Tailwind in your project
pnpm add -D tailwindcss postcss autoprefixer
```

## 📖 Documentation

### Storybook

Explore all components interactively:

```bash
cd packages/pulsar-formular-ui
pnpm storybook
```

Browse to `http://localhost:6007`

### Demo Application

Run the demo app:

```bash
pnpm dev
```

Browse to `http://localhost:3000`

See [src/demo.tsx](./src/demo.tsx) for the complete implementation.

## 🏗️ Architecture

```
@pulsar-framework/formular-ui
├── src/
│   ├── components/
│   │   ├── form-provider/     # FormProvider component
│   │   ├── form-context/      # Form context and hooks
│   │   ├── integrated/        # Full-featured components
│   │   ├── primitives/        # Basic field bindings
│   │   ├── portal/            # Portal system
│   │   └── modal/             # Modal dialogs
│   ├── types/                 # TypeScript interfaces
│   ├── utils/                 # Utility functions and hooks
│   ├── stories/               # Storybook stories
│   └── demo.tsx               # Demo application
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT © [Tadeo Piana](https://www.linkedin.com/in/tadeopiana/)

## 🔗 Links

- [Pulsar Framework](../pulsar.dev) - Reactive UI framework
- [formular.dev](../formular.dev) - Form management library
- [Pulsar UI](../pulsar-ui.dev) - Base UI components
- [GitHub Repository](https://github.com/binaryjack/pulsar-formular-ui)

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Need Help?**

- 📖 [Full Documentation](./docs/)
- 🐛 [Report Issues](https://github.com/binaryjack/pulsar-formular-ui/issues)
- 💬 [Discussions](https://github.com/binaryjack/pulsar-formular-ui/discussions)
