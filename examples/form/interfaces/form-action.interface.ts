/**
 * Field Update Payload Interface
 * Represents form field update data
 */
export interface IFieldUpdatePayload {
  fieldPath: string
  value: unknown
}

/**
 * Form Action Interface
 * Represents generic form action structure
 * Compatible with Redux UnknownAction
 */
export interface IFormAction {
  type: string
  payload?: unknown
  [key: string]: unknown
}

/**
 * Field Update Result Interface
 * Represents the result of a field update action
 */
export interface IFieldUpdateAction extends IFormAction {
  payload: IFieldUpdatePayload
}

/**
 * Field Clear Result Interface
 * Represents the result of a field clear action
 */
export interface IFieldClearAction extends IFormAction {
  payload: string
}
