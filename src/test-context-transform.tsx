/**
 * Test file to verify transformer generates deferred children for Context.Provider
 */
import { FormContext } from './components/form-context'
import { Checkbox } from './components/integrated/Checkbox'

// This should be transformed to have children as arrow function
export const TestContextTransform = () => {
  const contextValue = {} as any
  
  return (
    <FormContext.Provider value={contextValue}>
      <Checkbox name="test" />
    </FormContext.Provider>
  )
}
