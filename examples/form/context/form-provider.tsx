import { createContext, ReactNode, useCallback, useContext } from 'react'
import { IEntityDescriptor } from '../../../core/models/entity/interface/entity-descriptor.interface'
import { IFormContext } from '../interface/form-context.interface'
import type {
  IFieldClearAction,
  IFieldUpdateAction,
  IFieldUpdatePayload,
  IFormAction,
} from '../interfaces/form-action.interface'

interface FormActions {
  updateField: (payload: IFieldUpdatePayload) => IFieldUpdateAction
  clearField?: (fieldName: string) => IFieldClearAction
  loadAll?: () => IFormAction
  clearWorkingInstance?: () => IFormAction
}

interface IFormProviderProps<T extends object> {
  id: string
  feature: string
  model: IEntityDescriptor<T>
  dispatcher: (action: IFormAction) => void
  actions: FormActions
  submitCallback?: (data: T) => void
  children: ReactNode
}

const FormContext = createContext<IFormContext<object> | null>(null)

export const FormProvider = <T extends object>({ id, model, dispatcher, actions, children }: IFormProviderProps<T>) => {
  const fetch = useCallback(() => {
    if (actions.loadAll) {
      dispatcher(actions.loadAll())
    }
  }, [dispatcher, actions])

  const formContextData: IFormContext<T> = {
    model,
    updateField: (fieldPath: string, value: unknown) => {
      dispatcher(actions.updateField({ fieldPath, value }))
    },
    clearField: (fieldName: string) => {
      if (actions.clearField) {
        dispatcher(actions.clearField(fieldName))
      }
    },
    fetch,
    getField: (fieldName: string) => model.getField(fieldName),
    validateField: (fieldName: string) => model.validateField(fieldName),
    preValidateField: (fieldName: string, value: unknown) => model.preValidateField(fieldName, value),
    getValidations: (fieldName?: string) => model.getValidations(fieldName),
  }

  return (
    <FormContext.Provider value={formContextData}>
      <form id={`form-${id}`} className="space-y-6">
        {children}
      </form>
    </FormContext.Provider>
  )
}

export const useFormContext = <T extends object = Record<string, unknown>>(): IFormContext<T> => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider')
  }
  return context as IFormContext<T>
}
