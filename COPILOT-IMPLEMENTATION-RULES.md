# Pulsar Formular UI - Implementation Rules

## 🎯 Architecture Rules

These rules MUST be followed when creating or modifying components in this package.

---

## 0. Primitive Component Naming

**Rule:** All primitive form components MUST have `F` prefix to clearly identify formular mechanism components.

**Naming Convention:**

```typescript
// ✅ CORRECT
(FInputField, FCheckboxField, FRadioButton, FSelectField, FTextareaField, FToggleField);

// ❌ WRONG
(InputField, CheckboxField, RadioButton, SelectField);
```

**Rationale:** The `F` prefix immediately identifies the lowest atomic component that directly implements formular.dev DOM binding mechanisms.

---

## 1. Component Reuse

**Rule:** ALWAYS check for existing components before creating new ones.

**Search Locations (in order):**

1. `@pulsar-framework/pulsar.dev` (pulsar framework)
2. `@pulsar-framework/ui` (pulsar UI library)
3. Current package `@pulsar-framework/formular-ui`

**Examples:**

```typescript
// ✅ CORRECT - Import from pulsar framework
import { Portal } from 'pulsar/portal';

// ❌ WRONG - Recreating what exists
// Creating local Portal component when it exists in pulsar
```

**Rationale:** Avoid code duplication, maintain consistency, leverage framework capabilities.

---

## 2. TSX Syntax - Reserved Keywords

**Rule:** Use `className` instead of `class` in TSX/JSX.

```tsx
// ✅ CORRECT
<div className="form-field">...</div>

// ❌ WRONG
<div class="form-field">...</div>
```

**Other Reserved Keywords to Avoid:**

- `for` → `htmlFor`
- `class` → `className`

**Rationale:** `class` is a JavaScript reserved keyword. TSX/JSX uses `className` for DOM class attribute.

---

## 3. Primitive Component Output Rule (CRITICAL)

**Rule:** Primitive components output EXACTLY ONE DOM element + optional skeleton fallback on loading.

### Structure:

```typescript
const FInputField = ({ name, loading }: IFInputFieldProps) => {
  const { form } = useFormContext()
  const field = form.getFieldInput(name)

  // ✅ ONLY ONE OUTPUT - the input element itself
  if (loading) {
    return <div className="skeleton-loader" />
  }

  return <input {...field.register()} ref={field.ref()} />
}
```

### Violations:

```typescript
// ❌ WRONG - Extra wrapper div
return (
  <div className="field-wrapper">
    <input {...field.register()} />
  </div>
)

// ❌ WRONG - Extra label
return (
  <>
    <label>{label}</label>
    <input {...field.register()} />
  </>
)

// ❌ WRONG - Multiple containers
return (
  <div>
    <span>Icon</span>
    <input {...field.register()} />
  </div>
)
```

**Rationale:**

- Primitives are atomic - they represent ONE form control
- Layout/composition is handled by wrapper (FieldSet) components
- Keeps primitives reusable and composable
- Clear separation of concerns

---

## 4. DOM Binding with formular.dev

**Rule:** ALL primitive components MUST include BOTH `{...field.register()}` AND `ref={field.ref()}` for proper formular.dev integration.

### Correct Binding:

```typescript
const FInputField = ({ name }: IFInputFieldProps) => {
  const { form } = useFormContext()
  const field = form.getFieldInput(name)

  return (
    <input
      {...field.register()}    // ✅ Event handlers + ARIA attributes
      ref={field.ref()}          // ✅ DOM tracking + ref management
      placeholder={field.placeholder}
    />
  )
}
```

### Violations:

```typescript
// ❌ WRONG - Missing ref
<input {...field.register()} />

// ❌ WRONG - Only ref, missing register
<input ref={field.ref()} onChange={...} />
```

**What Each Does:**

- `register()` → Returns event handlers (onChange, onBlur, onFocus), ARIA attributes, id, type, className
- `ref()` → Calls `referencer(context, ref)` to track DOM element in `domManager` for programmatic access

**Rationale:** formular.dev requires both for complete field lifecycle management and DOM manipulation.

---

## 5. Portal Components

**Rule:** Import Portal components from pulsar framework. DO NOT create local portal implementations.

```typescript
// ✅ CORRECT
import { Portal } from 'pulsar/portal'

const CommandButtons = () => (
  <Portal mount="#command-portal">
    <button>Save</button>
    <button>Cancel</button>
  </Portal>
)

// ❌ WRONG
// Creating local portal-registry.ts, Portal.tsx, PortalSlot.tsx
```

**Available Imports:**

```typescript
import { Portal, cleanupPortals, getPortalManager } from 'pulsar/portal';
import type { IPortalProps, IPortalState, IPortalManager } from 'pulsar/portal';
```

**Rationale:** Pulsar framework provides a complete, tested Portal system. Use it.

---

## 6. ValidationResults Component Logic

**Rule:** Validation display MUST react to field state: `isPristine`, `isFocus`, `isError`.

### Display Rules:

```typescript
const ValidationResults = ({ name }: { name: string }) => {
  const { form } = useFormContext()
  const field = form.getFieldInput(name)

  // Rule 1: Pristine = NO validation display
  if (field.isPristine) {
    return null
  }

  // Rule 2: Not pristine + focused + error = GUIDE ONLY
  if (field.isFocus && field.errors.length > 0) {
    return field.guides.map((guide, i) => <GuideMessage key={i} text={guide} />)
  }

  // Rule 3: Not pristine + not focused + error = ERROR ONLY
  if (!field.isFocus && field.errors.length > 0) {
    return field.errors.map((error, i) => <ErrorMessage key={i} text={error} />)
  }

  // Rule 4: Not pristine + no error = NOTHING
  return null
}
```

### Child Components:

```typescript
// ErrorMessage component
const ErrorMessage = ({ text }: { text: string }) => (
  <div className="text-red-600 text-sm mt-1">{text}</div>
)

// GuideMessage component
const GuideMessage = ({ text }: { text: string }) => (
  <div className="text-blue-600 text-sm mt-1">{text}</div>
)
```

### Violations:

```typescript
// ❌ WRONG - No pristine check
if (field.errors.length > 0) { ... }

// ❌ WRONG - Not using independent components in .map()
{field.errors.map(e => <div>{e}</div>)}

// ❌ WRONG - Including title
<h3>Validation Results</h3>
```

**Rationale:**

- `isPristine` → User hasn't interacted yet, don't show validation
- `isFocus + error` → Show helpful guides while typing
- `!isFocus + error` → Show errors after leaving field
- Error/Guide as components → Proper React reconciliation in .map()

---

## 7. Integrated Component Naming

**Rule:** Integrated components (FieldSet wrappers) MUST have `Field` suffix.

**Naming Convention:**

```typescript
// ✅ CORRECT - Integrated components (wrappers)
(InputField, CheckboxField, TextareaField, SelectField, RadioGroupField, ToggleField);

// ✅ CORRECT - Primitives
(FInputField, FCheckboxField, FTextareaField, FSelectField, FRadioButton, FToggleField);

// ❌ WRONG - Ambiguous naming
(TextField, Checkbox, Input);
```

**Rationale:** Clear distinction between primitives (`F` prefix) and integrated FieldSet wrappers (`Field` suffix).

---

## 8. FieldSet Component Pattern

**Rule:** Integrated components wrap Label + Primitive + ValidationResults using ONLY `name` and `options` props.

### Type Definitions:

```typescript
/** Field options for debugging and loading states */
interface IFieldOptions {
  debug: boolean;
  loading: boolean;
}

/** Default field options factory */
const fieldOptions: IFieldOptions = {
  debug: false,
  loading: false,
};

/** Field component props - ONLY name and options */
interface IFieldProps {
  name: string; // ✅ ONLY prop: field name
  options?: IFieldOptions; // ✅ Optional configuration
}
```

### Structure:

```typescript
const InputField = ({ name, options = fieldOptions }: IFieldProps) => {
  const componentName = 'input'
  const { t } = useTranslation()

  return (
    <div id={`${name}-field-set`}>
      {/* Label section */}
      <div className="mb-2">
        <label
          id={`${name}-${componentName}-label`}
          htmlFor={`${name}-${componentName}`}
          className="block text-sm font-medium"
        >
          {t(`${name}-key`)}
        </label>
      </div>

      {/* Primitive component */}
      <div className="mb-1">
        <FInputField name={name} loading={options.loading} />
      </div>

      {/* Validation + Debug */}
      <div className="min-h-[20px]">
        <ValidationResults name={name} />
        {options.debug && <DebugInfo name={name} />}
      </div>
    </div>
  )
}
```

### Violations:

```typescript
// ❌ WRONG - Too many props
interface IInputFieldProps {
  name: string
  showLabel?: boolean      // ❌ NO
  showErrors?: boolean     // ❌ NO
  displayGuide?: boolean   // ❌ NO
  label?: string           // ❌ NO (use translation)
  placeholder?: string     // ❌ NO (from field descriptor)
}

// ❌ WRONG - Direct field access instead of name
const InputField = ({ field }: { field: IFieldDescriptor }) => { ... }

// ❌ WRONG - No translation
<label>{name}</label>
```

### Component Structure:

1. **Field Set Container** - `div` with `id="${name}-field-set"`
2. **Label Section** - `label` with `htmlFor` pointing to input, text from `t(${name}-key)`
3. **Primitive Section** - Single primitive component with `name` and `loading`
4. **Validation Section** - `ValidationResults` + optional `Debug`

### ID Pattern:

```typescript
// Field set
id={`${name}-field-set`}

// Label
id={`${name}-${componentName}-label`}
htmlFor={`${name}-${componentName}`}

// Input (handled by formular.dev register())
id={`${name}-${componentName}`}
```

**Rationale:**

- Single responsibility: FieldSet handles layout, primitive handles control
- Consistent API: All fields use same props
- Translation-driven: Labels come from i18n keys
- Debug mode: Controlled via options, not individual props
- Loading state: Passed through to primitive for skeleton

---

## Summary Checklist

When creating/modifying components, verify:

- [ ] Primitives have `F` prefix
- [ ] Integrated wrappers have `Field` suffix
- [ ] Checked for existing components in pulsar framework
- [ ] Used `className` instead of `class`
- [ ] Primitives output ONLY ONE element + skeleton
- [ ] Included BOTH `{...field.register()}` AND `ref={field.ref()}`
- [ ] Imported Portal from `pulsar/portal`
- [ ] ValidationResults implements pristine/focus/error logic
- [ ] FieldSet components use ONLY `name` + `options` props
- [ ] Used translation keys for labels: `t(${name}-key)`
- [ ] Followed ID pattern for field sets

---

## Examples

### ✅ Complete Correct Implementation:

```typescript
// Primitive: FInputField.tsx
interface IFInputFieldProps {
  name: string
  loading?: boolean
}

export const FInputField = ({ name, loading }: IFInputFieldProps) => {
  const { form } = useFormContext()
  const field = form.getFieldInput(name)

  if (loading) {
    return <div className="skeleton h-10 w-full bg-gray-200 animate-pulse rounded" />
  }

  return (
    <input
      {...field.register()}
      ref={field.ref()}
      className="border rounded px-3 py-2 w-full"
      placeholder={field.placeholder}
    />
  )
}

// Integrated: InputField.tsx
const fieldOptions: IFieldOptions = { debug: false, loading: false }

interface IInputFieldProps {
  name: string
  options?: IFieldOptions
}

export const InputField = ({ name, options = fieldOptions }: IInputFieldProps) => {
  const { t } = useTranslation()

  return (
    <div id={`${name}-field-set`}>
      <div className="mb-2">
        <label
          id={`${name}-input-label`}
          htmlFor={`${name}-input`}
          className="block text-sm font-medium"
        >
          {t(`${name}-key`)}
        </label>
      </div>
      <div className="mb-1">
        <FInputField name={name} loading={options.loading} />
      </div>
      <div className="min-h-[20px]">
        <ValidationResults name={name} />
        {options.debug && <DebugInfo name={name} />}
      </div>
    </div>
  )
}

// ValidationResults.tsx
const ErrorMessage = ({ text }: { text: string }) => (
  <div className="text-red-600 text-sm mt-1">{text}</div>
)

const GuideMessage = ({ text }: { text: string }) => (
  <div className="text-blue-600 text-sm mt-1">{text}</div>
)

export const ValidationResults = ({ name }: { name: string }) => {
  const { form } = useFormContext()
  const field = form.getFieldInput(name)

  if (field.isPristine) return null

  if (field.isFocus && field.errors.length > 0) {
    return field.guides.map((guide, i) => (
      <GuideMessage key={i} text={guide} />
    ))
  }

  if (!field.isFocus && field.errors.length > 0) {
    return field.errors.map((error, i) => (
      <ErrorMessage key={i} text={error} />
    ))
  }

  return null
}
```

---

**Last Updated:** January 24, 2026
**Version:** 1.0.0
**Package:** @pulsar-framework/formular-ui
