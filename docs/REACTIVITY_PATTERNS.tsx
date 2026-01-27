/**
 * Best Practices Guide for Pulsar Reactivity
 *
 * This guide demonstrates common patterns and pitfalls when working with
 * reactive state in Pulsar, especially when integrating with external libraries.
 */

import { useSync } from 'pulsar';
import { reactive } from 'pulsar/reactivity';
import type { IValidationResult } from './types/formular.types';

/**
 * ✅ CORRECT PATTERNS
 */

// Pattern 1: Reactive function that reads signal
export function Example_ReactiveFunction() {
  const signal = useSync(/* ... */);

  // ✅ GOOD: Function that reads signal - will update reactively
  const hasValue = () => signal().length > 0;

  return <div>{hasValue() && <span>Has value!</span>}</div>;
}

// Pattern 2: Using reactive helper with dev warnings
export function Example_ReactiveHelper() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);

  // ✅ GOOD: Wrapped in reactive() for dev-time validation
  const hasErrors = reactive(
    () => validationResults().some((r) => r.state === false),
    'hasErrors' // Debug name for helpful warnings
  );

  return <div>{hasErrors() && <ErrorList />}</div>;
}

// Pattern 3: Multiple derived signals
export function Example_MultipleDerived() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);

  // ✅ GOOD: Each is a reactive function
  const errors = () => validationResults().filter((r) => r.state === false);
  const warnings = () => validationResults().filter((r) => r.state === true && r.guide);
  const isValid = () => errors().length === 0;

  return (
    <div>
      {isValid() ? <Success /> : <ErrorDisplay errors={errors()} />}
      {warnings().length > 0 && <Warnings items={warnings()} />}
    </div>
  );
}

/**
 * ❌ COMMON MISTAKES
 */

// Mistake 1: Reading signal outside reactive context
export function Example_NonReactive_BAD() {
  const signal = useSync(/* ... */);

  // ❌ BAD: Reads signal once, creates constant
  // This will NEVER update when signal changes!
  const hasValue = signal().length > 0;

  return (
    <div>
      {hasValue && <span>Has value!</span>}
      {/* ⚠️ Will always show initial value, never updates */}
    </div>
  );
}

// Mistake 2: Destructuring signal result
export function Example_Destructuring_BAD() {
  const signal = useSync<{ count: number; items: string[] }>(/* ... */);

  // ❌ BAD: Destructuring reads signal once
  const { count, items } = signal();

  return (
    <div>
      <span>Count: {count}</span>
      {/* ⚠️ Will never update */}
    </div>
  );
}

// Mistake 3: Storing signal result in variable
export function Example_StoredResult_BAD() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);

  // ❌ BAD: Stores result in variable, not reactive
  const results = validationResults();
  const hasErrors = results.length > 0;

  return <div>{hasErrors && <Errors />}</div>;
  // ⚠️ Will never update when validation changes
}

/**
 * 🔧 FIXES FOR COMMON MISTAKES
 */

// Fix 1: Make it a function
export function Example_NonReactive_FIXED() {
  const signal = useSync(/* ... */);

  // ✅ GOOD: Function that reads signal
  const hasValue = () => signal().length > 0;

  return (
    <div>
      {hasValue() && <span>Has value!</span>}
      {/* ✅ Will update when signal changes */}
    </div>
  );
}

// Fix 2: Access properties in function
export function Example_Destructuring_FIXED() {
  const signal = useSync<{ count: number; items: string[] }>(/* ... */);

  // ✅ GOOD: Access properties through function call
  const getCount = () => signal().count;
  const getItems = () => signal().items;

  return (
    <div>
      <span>Count: {getCount()}</span>
      {getItems().map((item) => (
        <div key={item}>{item}</div>
      ))}
      {/* ✅ Will update when signal changes */}
    </div>
  );
}

// Fix 3: Keep everything as functions
export function Example_StoredResult_FIXED() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);

  // ✅ GOOD: Everything stays as functions
  const hasErrors = () => validationResults().some((r) => r.state === false);
  const getErrors = () => validationResults().filter((r) => r.state === false);

  return (
    <div>
      {hasErrors() && (
        <ErrorList>
          {getErrors().map((err) => (
            <ErrorItem key={err.code}>{err.error}</ErrorItem>
          ))}
        </ErrorList>
      )}
      {/* ✅ Will update when validation changes */}
    </div>
  );
}

/**
 * 💡 ADVANCED PATTERNS
 */

// Pattern: Computed signals with multiple dependencies
export function Example_MultipleSignals() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);
  const formData = useSync<Record<string, any>>(/* ... */);

  // ✅ GOOD: Function reads multiple signals
  const canSubmit = () => {
    const isValid = validationResults().every((r) => r.state !== false);
    const hasData = Object.keys(formData()).length > 0;
    return isValid && hasData;
  };

  return (
    <button disabled={!canSubmit()} onClick={handleSubmit}>
      Submit
    </button>
  );
}

// Pattern: Conditional signal reading
export function Example_ConditionalReading() {
  const validationResults = useSync<IValidationResult[]>(/* ... */);
  const showValidation = useSync<boolean>(/* ... */);

  // ✅ GOOD: Conditionally read based on another signal
  const visibleErrors = () => {
    if (!showValidation()) return [];
    return validationResults().filter((r) => r.state === false);
  };

  return (
    <div>
      {visibleErrors().map((err) => (
        <ErrorMessage key={err.code}>{err.error}</ErrorMessage>
      ))}
    </div>
  );
}
