/**
 * Manual test to verify deferred children evaluation works with Context.Provider
 * This will be compiled by TypeScript with the transformer
 */
import { FormContext } from './src/components/form-context'
import { Checkbox } from './src/components/integrated/Checkbox'

console.log('[TEST] Creating form context...')

const mockForm = {
  id: 'test-form',
  getField: (name: string) => ({
    name,
    label: 'Test Field',
    value: false,
    errors: [],
    touched: false,
    setValue: (v: unknown) => console.log('setValue:', v),
    validate: () => true,
  })
} as any

const contextValue = {
  form: mockForm,
  updateField: (name: string, value: unknown) => console.log('updateField:', name, value),
  clearField: (name: string) => console.log('clearField:', name),
  reset: () => console.log('reset'),
  getField: (name: string) => mockForm.getField(name),
  validateField: (name: string) => console.log('validateField:', name),
  preValidateField: (name: string) => true,
  validateForm: () => true,
  getErrors: () => []
} as any

console.log('[TEST] Rendering FormProvider with Checkbox...')

try {
  const app = (
    <FormContext.Provider value={contextValue}>
      <div>
        <h2>Form Test</h2>
        <Checkbox name="testCheckbox" />
      </div>
    </FormContext.Provider>
  )
  
  document.getElementById('root')!.appendChild(app)
  console.log('%c✓ [TEST] Rendered successfully - context worked!', 'color: green; font-weight: bold')
} catch (error) {
  console.error('%c✗ [TEST] ERROR:', 'color: red; font-weight: bold', error)
}
